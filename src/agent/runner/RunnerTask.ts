import { Page } from 'playwright'
import OpenAI from 'openai'

import { Runner } from './Runner'
import { Agent } from '../Agent'
import { PromptsTransformer } from '../../transformers/Prompts.transformer'
import { OpenAIService } from '../../services/OpenAI.service'
import { PlaywrightService } from '../../services/Playwright.service'
import { ActionType, CONFIG } from '../../constants'
import { Logger } from '../../logger'

export type TaskResult = {
    success: boolean
    message: string
    value?: string
}

export class RunnerTask extends Runner {
    private actions: string[] = []

    constructor(
        agent: Agent,
        page: Page,
        openai: OpenAIService,
        pw: PlaywrightService,
        private readonly task: string
    ) {
        super(agent, page, openai, pw)
    }

    async launch(): Promise<TaskResult> {
        Logger.debug('Starting...')

        await this.sleep(1000)

        let cycles = 0
        let failed_cycles = 0

        while (
            cycles < CONFIG.api.max_cycles &&
            failed_cycles < CONFIG.api.max_failed_cycles
        ) {
            const cycleStart = Date.now()

            // Check if page is loading to avoid context loss
            await this.page.waitForFunction(
                () => document.readyState === 'complete'
            )

            const prompt = PromptsTransformer.transformTaskUserPrompt({
                url: this.page.url(),
                title: await this.page.title(),
                task: this.task,
                actions: this.actions,
            })

            const screenshot = await this.screenshot()

            const messages: OpenAI.ChatCompletionMessageParam[] = [
                {
                    role: 'system',
                    content: PromptsTransformer.transformTaskSystemPrompt(),
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
                                detail: 'auto',
                            },
                        },
                    ],
                },
            ]

            const result = await this.openai.completion(messages)

            const choice = result.choices[0]
            const message = choice.message.content

            if (!message) {
                Logger.error('No message returned from OpenAI')
                break
            }

            Logger.debug(
                `[${cycles}/${CONFIG.api.max_cycles}]: ${result.usage?.total_tokens} (${choice.finish_reason})\n${message}`
            )

            const reasoning = this.parseReasoning(message)
            const action = this.parseAction(message)
            if (action.type === ActionType.Done) {
                return {
                    success: true,
                    message: action.description,
                    value: action.value,
                }
            } else if (action.type === ActionType.Fail) {
                return {
                    success: false,
                    message: action.description,
                    value: action.value,
                }
            }

            const actionResult = await this.handleAction(action)
            this.actions.push(
                actionResult.unwrapUnchecked() +
                    ` ${actionResult.isErr() ? '[FAIL]' : '[DONE]'}`
            )

            Logger.action(
                action.type,
                actionResult.unwrapUnchecked(),
                actionResult.isOk(),
                reasoning.unwrapOr(''),
                Date.now() - cycleStart,
                result.usage?.total_tokens
            )

            if (actionResult.isErr()) failed_cycles++
            cycles++

            await this.sleep(CONFIG.api.delay)
        }

        if (failed_cycles >= CONFIG.api.max_failed_cycles) {
            return {
                success: false,
                message: 'Reached maximum failed actions',
            }
        } else {
            return {
                success: false,
                message: 'Reached maximum actions',
            }
        }
    }
}
