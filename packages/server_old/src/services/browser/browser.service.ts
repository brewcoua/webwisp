import { Injectable, Logger } from '@nestjs/common'
import { Browser, chromium } from 'playwright'

import config, { REMOTE_PORT } from './browser.config'
import { ContextWrapper, PageWrapper } from './wrappers'
import { Contexts } from '../../constants'

@Injectable()
export default class BrowserService {
    private browser?: Browser
    private context?: ContextWrapper

    public async initialize(): Promise<void> {
        try {
            this.browser = await chromium.launch(config.options)

            const context = await this.browser?.newContext(config.context)
            if (!context) {
                Logger.error(
                    'Failed to create context',
                    Contexts.BrowserService
                )
                throw new Error('Failed to create context')
            }

            this.context = new ContextWrapper(context)

            Logger.log(
                `Browser initialized, CDP listening on http://localhost:${REMOTE_PORT}`,
                Contexts.BrowserService
            )
        } catch (err: any) {
            Logger.fatal(
                'Failed to launch browser',
                err.stack,
                Contexts.BrowserService
            )
            throw new Error('Failed to launch browser: ' + err)
        }
    }

    public async destroy(): Promise<void> {
        try {
            await this.context?.destroy()
            await this.browser?.close()
            return
        } catch (error: any) {
            Logger.error(
                'Failed to gracefully close browser',
                error.stack,
                Contexts.BrowserService
            )
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
