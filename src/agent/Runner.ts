import { Agent } from './Agent'
import { OpenAIService } from '../services/OpenAI.service'
import { PromptsTransformer } from '../transformers/Prompts.transformer'
import { useConfig, usePrompts } from '../hooks'

import { Logger } from 'pino'
import OpenAI from 'openai'
import { Err, Ok, Result } from 'oxide.ts'
import { Grounding, GroundingFactory } from '../domain/Grounding'
import { Page } from 'playwright'
import { ElementPointer } from '../grounding/Attributes.grounding'
import { Methods } from '../domain/Public'
import { VisualGrounding } from '../grounding/Visual.grounding'

type Action = {
    type: 'click' | 'type',
    element?: ElementPointer,
    label?: number,
    value?: string
}

export class Runner {
    constructor(
        private readonly agent: Agent,
        private readonly target: string,
        private readonly steps: string[],
        private readonly page: Page,
        private readonly openai: OpenAIService,
        private readonly logger: Logger,
    ) {
    }

    private groundings: {
        [key in Methods]?: Grounding
    } = {}

    async handleAction(action: Action): Promise<Result<string, string>> {
        let element
        for (const grounding of Object.values(this.groundings)) {
            element = await grounding.resolve(action.element)
            if (element.isSome()) {
                break
            }
        }

        if (!element || element.isNone()) {
            return Err(`Element not found with:\n- element: ${action.element ? JSON.stringify(action.element) : 'No element'}\n- label: ${action.label || 'No label'}`)
        }


        switch (action.type) {
            case 'click':
                await element.unwrap().click()
                return Ok('Clicked')
            case 'type':
                await element.unwrap().fill(action.value || '')
                return Ok('Typed')
        }
    }

    async screenshot(): Promise<string> {
        if (this.groundings.visual) {
            return (this.groundings.visual as VisualGrounding).getScreenshot()
        } else {
            const buf = await this.page.screenshot()
            return `data:image/png;base64,${buf.toString('base64')}`
        }
    }

    async sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    async run() {
        this.logger.debug('Starting...')

        const config = useConfig()

        this.groundings = Object.fromEntries(
            config.methods.map(method => [
                method,
                GroundingFactory.create(method, this.page, this.logger),
            ]),
        )

        const tools = PromptsTransformer.transformTools()

        let currentStep = 0
        while (currentStep < this.steps.length) {
            this.logger.info(`Step ${currentStep}: ${this.steps[currentStep]}`)

            const prompt = PromptsTransformer.transformUserPrompt({
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