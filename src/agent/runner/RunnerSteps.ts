import { Page } from 'playwright'
import { Logger } from 'pino'

import { Runner } from './Runner'
import { Agent } from '../Agent'

import { OpenAIService } from '../../services/OpenAI.service'
import OpenAI from 'openai'
import { useConfig } from '../../hooks'
import { PromptsTransformer } from '../../transformers/Prompts.transformer'

export class RunnerSteps extends Runner {
    constructor(
        agent: Agent,
        target: string,
        page: Page,
        openai: OpenAIService,
        logger: Logger,
        private readonly steps: string[],
    ) {
        super(agent, target, page, openai, logger)
    }

    async launch() {
        this.logger.debug('Starting...')

        await this.sleep(10000)

        const config = useConfig()

        const tools = PromptsTransformer.transformTools()

        let currentStep = 0
        while (currentStep < this.steps.length) {
            this.logger.info(`Step ${currentStep}: ${this.steps[currentStep]}`)

            const prompt = PromptsTransformer.transformStepsUserPrompt({
                currentStep,
                steps: this.steps,
                url: this.page.url(),
            })

            const screenshot = await this.screenshot()

            const messages: OpenAI.ChatCompletionMessageParam[] = [
                {
                    role: 'system',
                    content: PromptsTransformer.transformSystemPrompt(),
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
                                detail: config.methods.includes(Methods.Visual) ? 'auto' : 'low',
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
                const result = await this.openai.completion(messages, tools, 'required')
                cycles++

                const choice = result.choices[0]

                this.logger.debug(result.usage, 'Cycle finished: ' + choice.finish_reason)

                messages.push(choice.message)

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
                        const output = await this.handleAction(action)

                        messages.push({
                            tool_call_id: tool_call.id,
                            role: 'tool',
                            content: output.expect('Failed to handle action:\n- ' + output.unwrapUnchecked()),
                        })
                    }
                } else {
                    break
                }

                await this.sleep(config.api.delay / 2)
            }

            if (cycles === config.api.max_cycles) {
                this.logger.warn(`Max cycles reached for step ${currentStep}`)
            }

            this.logger.info({
                ...total_result,
                message: undefined,
            }, `[${currentStep + 1}/${this.steps.length}]: ${total_result.message}`)

            currentStep++
            await this.sleep(config.api.delay)
        }

        this.logger.info('Done!')
    }
}