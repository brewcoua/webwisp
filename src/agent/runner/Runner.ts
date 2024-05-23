import { Agent } from '../Agent'
import { OpenAIService } from '../../services/OpenAI.service'
import { useConfig } from '../../hooks'

import { Logger } from 'pino'
import { Err, Ok, Result } from 'oxide.ts'
import { JSHandle, Page } from 'playwright'

import { VisualGrounding } from '../../grounding/Visual.grounding'


type ActionType = 'click' | 'type' | 'scroll_down' | 'scroll_up' | 'done' | 'fail'
type Action = {
    type: ActionType,
    label?: number,
    value?: string,
}

export abstract class Runner {
    protected constructor(
        protected readonly agent: Agent,
        protected readonly target: string,
        protected readonly page: Page,
        protected readonly openai: OpenAIService,
        protected readonly logger: Logger,
    ) {
    }

    private grounding!: VisualGrounding

    public async initialize(): Promise<void> {
        this.grounding = new VisualGrounding(this.page, this.logger)
        await this.grounding.initialize()
    }

    protected async handleAction(action: Action): Promise<Result<string, string>> {
        if (action.type.startsWith('scroll')) {
            const direction = action.type === 'scroll_down' ? 'down' : 'up'
            await this.page.evaluate(`window.scrollBy({ top: ${
                direction === 'down' ? '-' : ''
            }window.innerHeight, behavior: 'smooth' })`)
            return Ok(`Scroll ${direction} [DONE]`)
        }

        const element = await this.grounding.resolve(action.label || 0)

        if (!element || element.isNone()) {
            return Err(`${action.type}: #${action.label} not found [FAIL]`)
        }

        let el = (await element.unwrap().getProperty('outerHTML')).toString()

        // Only keep the tag of the element
        let elStr = el.match(/<[^>]*>/)?.[0] || ''

        const text = await element.unwrap().textContent()
        const value = await element.unwrap().getProperty('value')
        const tagName = await element.unwrap().getProperty('tagName')

        switch (action.type) {
            case 'click':
                await element.unwrap().click()
                break
            case 'type':
                await element.unwrap().fill(action.value || '')
                break
            default:
                return Err('Unknown action')
        }

        this.logger.debug(`Action ${action.type} on #${action.label} (<${elStr}>${text || value || ''}</${tagName}>) [DONE]`)

        return Ok(`${action.type}: #${action.label} (<${elStr}>${text || value || ''}</${tagName}>) [DONE]`)
    }

    protected parseAction(message: string): Action {
        // Parse following this template
        /*
         * Message....
         * ...
         * """
         * ACTION: click
         * LABEL: 2
         * VALUE: text (optional)
         * """
         */
        // We want to get ACTION, LABEL and VALUE
        // First get stuff between """
        const raw = message.match(/"""([^]*)"""/)
        if (!raw) {
            throw new Error('No action found')
        }

        // Split by new line
        const lines = raw[1].split('\n')

        let action = {} as Action;
        lines.forEach((line) => {
            if (line.trim() === '')
                return;

            const [key, value] = line.split(':')
            console.log(key.trim(), value.trim())

            switch (key.trim()) {
                case 'ACTION':
                    action.type = value.trim() as ActionType
                    break
                case 'ELEMENT':
                    action['label'] = parseInt(value.trim())
                    break
                case 'VALUE':
                    action['value'] = value.trim()
                    break
            }
        });

        this.logger.debug(action, 'Action parsed')
        return action;
    }

    protected async screenshot(): Promise<string> {
        return this.grounding.getScreenshot()
    }

    protected async sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    abstract launch(): Promise<void>
}