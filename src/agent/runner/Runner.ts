import { Err, Ok, Result } from 'oxide.ts'
import { Page } from 'playwright'

import { Agent } from '../Agent'
import { OpenAIService } from '../../services/OpenAI.service'
import { Grounding } from '../Grounding'
import { PlaywrightService } from '../../services/Playwright.service'
import { useConfig } from '../../constants'
import { Logger } from '../../logger'
import {
    ActionType,
    CalledAction,
    CalledActionStatus,
    ImageURL,
    TaskResult,
} from '../../domain/config'
import PromptBuilder from '../PromptBuilder'
import CompletionParser from '../CompletionParser'

export class Runner {
    private grounding!: Grounding

    public constructor(
        private readonly agent: Agent,
        private readonly page: Page,
        private readonly openai: OpenAIService,
        private readonly pw: PlaywrightService,
        private readonly task: string
    ) {}

    public async initialize(): Promise<void> {
        this.grounding = new Grounding(this.page)
        await this.grounding.initialize()
    }

    public async launch(): Promise<TaskResult> {
        let cycles = 0,
            failedCycles = 0

        const config = useConfig()
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

                    const actionResult = await this.handleAction(parsed.action)
                    parsed.action.status = actionResult.isOk()
                        ? CalledActionStatus.Success
                        : CalledActionStatus.Failed

                    actions.push(parsed.action)

                    Logger.action(
                        parsed.action,
                        parsed.reasoning,
                        Date.now() - cycleStart,
                        completion.usage?.total_tokens
                    )

                    if (actionResult.isErr()) {
                        failedCycles++
                    }
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

    private async handleAction(
        action: CalledAction
    ): Promise<Result<string, string>> {
        switch (action.type) {
            case ActionType.Scroll: {
                const direction = action.arguments.direction as 'up' | 'down'

                // Scroll by 2/3 of the window height
                await this.page.evaluate(
                    `window.scrollBy({ top: ${
                        direction === 'down' ? '' : '-'
                    }((window.innerHeight / 3) * 2) })`
                )

                return Ok(action.description)
            }
            case ActionType.PressEnter: {
                await this.page.keyboard.press('Enter')
                return Ok(action.description)
            }
            case ActionType.Back: {
                await this.page.goBack({
                    waitUntil: 'domcontentloaded',
                })
                return Ok(action.description)
            }
            case ActionType.Forward: {
                await this.page.goForward({
                    waitUntil: 'domcontentloaded',
                })
                return Ok(action.description)
            }
            case ActionType.Click:
            case ActionType.Type: {
                const element = await this.grounding.resolve(
                    action.arguments.label as number
                )

                if (!element || element.isNone()) {
                    return Err(`#${action.arguments.label} not found`)
                }

                try {
                    switch (action.type) {
                        case ActionType.Click:
                            await element.unwrap().click()
                            break
                        case ActionType.Type:
                            await element
                                .unwrap()
                                .fill(action.arguments.value as string)
                            break
                    }

                    Logger.debug(
                        `Action ${action.type} on #${action.arguments.label} (${action.description}) [DONE]`
                    )

                    return Ok(action.description)
                } catch (err: any) {
                    return Err(
                        `Error while performing ${action.type} on #${action.arguments.label} (${action.description}): ${err.message}`
                    )
                }
            }
            default:
                return Err(
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
