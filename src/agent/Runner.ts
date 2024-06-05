import { Page } from 'playwright'

import Logger from '@/logger'
import OpenAIService from '@/services/OpenAIService'

import type TaskResult from '@/domain/TaskResult'
import type CalledAction from '@/domain/CalledAction'
import { getConfig } from '@/domain/Config'
import ActionType from '@/domain/ActionType'
import CalledActionStatus from '@/domain/CalledActionStatus'
import type ImageURL from '@/domain/ImageURL'

import Grounding from './Grounding'
import PromptBuilder from './PromptBuilder'
import CompletionParser from './CompletionParser'

export default class Runner {
    private grounding!: Grounding

    public constructor(
        private readonly page: Page,
        private readonly openai: OpenAIService,
        private readonly task: string
    ) {}

    public async initialize(): Promise<void> {
        this.grounding = new Grounding(this.page)
        await this.grounding.initialize()
    }

    public async launch(): Promise<TaskResult> {
        let cycles = 0,
            failedCycles = 0

        const config = getConfig()
        const actions: CalledAction[] = []

        while (
            cycles < config.api.max_cycles &&
            failedCycles < config.api.max_failed_cycles
        ) {
            const cycleStart = Date.now()

            // Make sure the page is fully loaded
            await this.page.waitForLoadState('domcontentloaded')

            const screenshot = await this.screenshot()

            const system = PromptBuilder.makeSystem()
            const user = PromptBuilder.makeUser({
                title: await this.page.title(),
                url: this.page.url(),
                task: this.task,
                previous_actions: actions,
                screenshot,
            })

            let failedFormatting = 0

            while (failedFormatting < config.api.max_failed_formatting) {
                const completion = await this.openai.completion(
                    system.concat(user)
                )

                const choice = completion.choices[0]
                const message = choice.message.content?.trim() || ''

                if (!message) {
                    Logger.error('Empty message received from OpenAI')
                    failedFormatting++
                    continue
                }

                Logger.debug(message)

                try {
                    const parsed = CompletionParser.parse(message)

                    if (parsed.action.type === ActionType.Done) {
                        const success =
                            parsed.action.arguments.value === 'success'
                        return {
                            success,
                            message: `Task completed with status: ${success ? 'success' : 'failure'}`,
                            value: parsed.action.arguments.reason as string,
                        }
                    }

                    try {
                        await this.handleAction(parsed.action)
                        parsed.action.status = CalledActionStatus.Success
                    } catch (err: any) {
                        parsed.action.status = CalledActionStatus.Failed
                        failedCycles++
                        Logger.error(err.message)
                    }

                    actions.push(parsed.action)

                    Logger.action(
                        parsed.action,
                        parsed.reasoning,
                        Date.now() - cycleStart,
                        completion.usage?.total_tokens
                    )

                    cycles++
                    break
                } catch (err: any) {
                    Logger.error(
                        `Error while parsing completion: ${err.message}`
                    )
                    failedFormatting++
                }
            }

            if (failedFormatting >= config.api.max_failed_formatting) {
                Logger.error(
                    `Failed to format completion after ${failedFormatting} attempts`
                )
                break
            }

            await this.sleep(config.api.delay)
        }

        if (failedCycles >= config.api.max_failed_cycles) {
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

    private async handleAction(action: CalledAction): Promise<void> {
        switch (action.type) {
            case ActionType.Scroll: {
                const direction = action.arguments.direction as 'up' | 'down'

                // Scroll by 2/3 of the window height
                await this.page.evaluate(
                    `window.scrollBy({ top: ${
                        direction === 'down' ? '' : '-'
                    }((window.innerHeight / 3) * 2) })`
                )
                break
            }
            case ActionType.PressEnter: {
                await this.page.keyboard.press('Enter')
                break
            }
            case ActionType.Back: {
                await this.page.goBack({
                    waitUntil: 'domcontentloaded',
                })
                break
            }
            case ActionType.Forward: {
                await this.page.goForward({
                    waitUntil: 'domcontentloaded',
                })
                break
            }
            case ActionType.Click:
            case ActionType.Type: {
                const element = await this.grounding.resolve(
                    action.arguments.label as number
                )

                if (!element) {
                    throw new Error(
                        `Element #${action.arguments.label} not found`
                    )
                }

                try {
                    switch (action.type) {
                        case ActionType.Click:
                            await element.click()
                            break
                        case ActionType.Type:
                            await element.fill(action.arguments.text as string)
                            break
                    }

                    Logger.debug(
                        `Action ${action.type} on #${action.arguments.label} (${action.description}) [DONE]`
                    )
                } catch (err: any) {
                    throw new Error(
                        `Error while performing ${action.type} on #${action.arguments.label} (${action.description}): ${err.message}`
                    )
                }
                break
            }
            default:
                throw new Error(
                    `Unknown action type '${action.type}' to be performed`
                )
        }
    }

    private async screenshot(): Promise<ImageURL> {
        return this.grounding.getScreenshot() as Promise<ImageURL>
    }

    private async sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }
}
