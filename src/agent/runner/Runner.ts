import { Err, None, Ok, Option, Result, Some } from 'oxide.ts'
import { Page } from 'playwright'

import { Agent } from '../Agent'
import { OpenAIService } from '../../services/OpenAI.service'
import { VisualGrounding } from '../../grounding/Visual.grounding'
import { PlaywrightService } from '../../services/Playwright.service'
import { ActionType } from '../../constants'
import { Logger } from '../../logger'

type Action = {
    type: ActionType
    description: string
    label?: number
    value?: string
}

export abstract class Runner {
    private grounding!: VisualGrounding

    protected constructor(
        protected readonly agent: Agent,
        protected readonly page: Page,
        protected readonly openai: OpenAIService,
        protected readonly pw: PlaywrightService
    ) {}

    public async initialize(): Promise<void> {
        this.grounding = new VisualGrounding(this.page)
        await this.grounding.initialize()
    }

    abstract launch(): Promise<any>

    protected async handleAction(
        action: Action
    ): Promise<Result<string, string>> {
        if (action.type.startsWith('scroll')) {
            const direction = action.type === 'scroll_down' ? 'down' : 'up'

            // Scroll by 2/3 of the window height
            await this.page.evaluate(
                `window.scrollBy({ top: ${
                    direction === 'down' ? '' : '-'
                }((window.innerHeight / 3) * 2) })`
            )

            return Ok(action.description)
        } else if (action.type === ActionType.PressEnter) {
            await this.page.keyboard.press('Enter')
            return Ok(action.description)
        }

        const element = await this.grounding.resolve(action.label || 0)

        if (!element || element.isNone()) {
            return Err(`${action.type}: #${action.label} not found`)
        }

        try {
            switch (action.type) {
                case ActionType.Click:
                    await element.unwrap().click()
                    break
                case ActionType.Type:
                    await element.unwrap().fill(action.value || '')
                    break
                default:
                    return Err(`Unknown action type: ${action.type}`)
            }

            Logger.debug(
                `Action ${action.type} on #${action.label} (${action.description}) [DONE]`
            )

            return Ok(action.description)
        } catch (err) {
            return Err(
                `Error while performing ${action.type} on #${action.label} (${action.description}): ${err.message}`
            )
        }
    }

    protected parseAction(message: string): Action {
        // First get stuff between ~~~
        const raw = message.match(/~~~([^]*)~~~/)
        if (!raw) {
            throw new Error('No action found')
        }

        // Split by new line
        const lines = raw[1].split('\n')

        let action = {} as Action
        lines.forEach((line) => {
            if (line.trim() === '') return

            const [key, value] = line.split(':')

            switch (key.trim()) {
                case 'DESCRIPTION':
                    action.description = value.trim()
                    break
                case 'ACTION':
                    action.type = value.trim() as ActionType
                    break
                case 'ELEMENT':
                    action.label = parseInt(value.trim())
                    break
                case 'VALUE':
                    action.value = value.trim()
                    break
            }
        })

        Logger.debug(`Parsed action: ${JSON.stringify(action)}`)
        return action
    }

    protected parseReasoning(message: string): Option<string> {
        // Parse stuff after "## Next Action ##\n" and before "~~~"
        const raw = message.split('## Next Action ##\n')?.at(1)?.split('~~~')
        if (!raw) {
            return None
        }

        return Some(raw[0].trim())
    }

    protected async screenshot(): Promise<string> {
        return this.grounding.getScreenshot()
    }

    protected async sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }
}
