import { Agent } from './Agent'
import { PageController } from '../services/Playwright.service'
import { OpenAIService } from '../services/OpenAI.service'
import { PromptsTransformer } from '../transformers/Prompts.transformer'
import { useConfig, usePrompts } from '../hooks'

import { Logger } from 'pino'
import OpenAI from 'openai'

type Action = {
    type: 'click' | 'type',
    element: {
        role: 'button' | 'link' | 'input'
        name: string
    },
    value?: string
}

export class Runner {
    constructor(
        private readonly agent: Agent,
        private readonly target: string,
        private readonly steps: string[],
        private readonly page: PageController,
        private readonly openai: OpenAIService,
        private readonly logger: Logger,
    ) {
    }

    async handleAction(action: Action) {
        switch (action.type) {
            case 'click':
                return this.page.click(action.element)
            case 'type':
                return this.page.type({
                    text: action.value || '',
                    name: action.element.name,
                })
        }
    }

    async sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    async run() {
        this.logger.debug('Starting...')

        const config = useConfig()

        let currentStep = 0
        while (currentStep < this.steps.length) {
            this.logger.info(`Step ${currentStep}: ${this.steps[currentStep]}`)

            const prompt = PromptsTransformer.transformUserPrompt({
                currentStep,
                steps: this.steps,
                url: await this.page.getUrl(),
            })
            const screenshot = await this.page.screenshot()

            const messages: OpenAI.ChatCompletionMessageParam[] = [
                {
                    role: 'system',
                    content: usePrompts().system.join('\n'),
                },
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: prompt,
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                url: screenshot,
                                detail: 'low',
                            },
                        },
                    ],
                },
            ]

            const total_result: {
                usage: OpenAI.CompletionUsage,
                message: string,
                reason: string,
            } = {
                usage: {
                    completion_tokens: 0,
                    prompt_tokens: 0,
                    total_tokens: 0,
                },
                message: '',
                reason: '',
            }

            let cycles = 0
            while (cycles < config.api.max_cycles) {
                this.logger.debug(`[${currentStep + 1}/${this.steps.length}]: Cycle ${cycles + 1}/${config.api.max_cycles}`)
                const result = await this.openai.completion(messages, usePrompts().tools, 'required')
                cycles++;

                this.logger.debug(result, 'Result for cycle');

                const choice = result.choices[0]

                messages.push(choice.message);

                if (result.usage) {
                    total_result.usage.completion_tokens += result.usage.completion_tokens
                    total_result.usage.prompt_tokens += result.usage.prompt_tokens
                    total_result.usage.total_tokens += result.usage.total_tokens
                }
                if (choice.finish_reason) {
                    total_result.reason = choice.finish_reason
                }
                if (choice.message.content) {
                    total_result.message += choice.message.content
                }
                if (choice.message.tool_calls) {
                    for (const tool_call of choice.message.tool_calls) {
                        const action: Action = JSON.parse(tool_call.function.arguments)
                        const output = await this.handleAction(action);
                        messages.push({
                            tool_call_id: tool_call.id,
                            role: 'tool',
                            content: output,
                        })
                    }
                } else {
                    break;
                }

                await this.sleep(config.api.delay / 2)
            }

            if (cycles === config.api.max_cycles) {
                this.logger.warn(`Max cycles reached for step ${currentStep}`)
            }

            this.logger.info({...total_result, message: undefined}, `[${currentStep + 1}/${this.steps.length}]: ${total_result.message}`)

            currentStep++
            await this.sleep(config.api.delay)
        }

        this.logger.info('Done!')
    }
}