import { Browser, chromium } from 'playwright'
import { Logger } from 'winston'

import config, { REMOTE_PORT } from './browser.config'
import { ContextWrapper, PageWrapper } from './wrappers'

export default class BrowserService {
    private browser?: Browser
    private context?: ContextWrapper

    private readonly logger: Logger

    constructor(logger: Logger) {
        this.logger = logger.child({
            context: 'BrowserService',
        })
    }

    public async initialize(): Promise<void> {
        try {
            this.browser = await chromium.launch(config.options)

            const context = await this.browser?.newContext(config.context)
            if (!context) {
                this.logger.error('Failed to create context')
                throw new Error('Failed to create context')
            }

            this.context = new ContextWrapper(context, this.logger)

            this.logger.info(
                `Browser initialized, CDP listening on http://localhost:${REMOTE_PORT}`
            )
        } catch (err: any) {
            this.logger.crit('Failed to launch browser', {
                stack: err.stack,
            })
            throw new Error('Failed to launch browser: ' + err)
        }
    }

    public async destroy(): Promise<void> {
        try {
            await this.context?.destroy()
            await this.browser?.close()
            return
        } catch (error: any) {
            this.logger.error('Failed to gracefully close browser', {
                stack: error.stack,
            })
            return
        }
    }

    public async detach(url?: string): Promise<PageWrapper> {
        const page = await this.context?.detach(url)
        if (!page) {
            throw new Error('Failed to detach page')
        }
        return page
    }
}
