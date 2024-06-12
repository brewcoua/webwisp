import { Logger } from 'winston'

import Service from '@/domain/Service'
import WebwispError from '@/domain/WebwispError'

import config from './BrowserConfig'

import BrowserWrapper from './wrappers/BrowserWrapper'
import BrowserContextWrapper from './wrappers/BrowserContextWrapper'

export default class BrowserService extends Service {
    private browser!: BrowserWrapper

    constructor(logger: Logger) {
        super('Browser', logger)
    }

    public async initialize(): Promise<void> {
        const browser = await BrowserWrapper.new(
            config.type,
            this.logger,
            config.options
        )
        if (!browser) {
            throw new WebwispError('Failed to initialize browser')
        }

        this.browser = browser
    }

    public async destroy(): Promise<void> {
        await this.browser.destroy()
    }

    public async newContext(): Promise<BrowserContextWrapper | null> {
        return this.browser.makeContext(config.context)
    }
}
