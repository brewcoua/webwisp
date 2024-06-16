import { Inject, Injectable } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import { Browser, chromium } from 'playwright'

import config, { REMOTE_PORT } from './browser.config'
import { ContextWrapper, PageWrapper } from './wrappers'

@Injectable()
export default class BrowserService {
    private browser?: Browser
    private context?: ContextWrapper
    private readonly logger: Logger

    constructor(@Inject(WINSTON_MODULE_PROVIDER) logger: Logger) {
        this.logger = logger.child({ service: 'Browser' })
    }

    public async initialize(): Promise<void> {
        try {
            this.browser = await chromium.launch(config.options)

            const context = await this.browser?.newContext(config.context)
            if (!context) {
                this.logger.error('Failed to create context')
                throw new Error('Failed to create context')
            }

            this.context = new ContextWrapper(
                context,
                this.logger.child({
                    wrapper: 'Context',
                })
            )

            this.logger.info(
                `Browser initialized, CDP listening on http://localhost:${REMOTE_PORT}`
            )
        } catch (err: any) {
            this.logger.crit('Failed to launch browser', {
                error: {
                    message: err.message,
                    stack: err.stack,
                },
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
            this.logger.warn('Failed to gracefully close browser', {
                error: {
                    message: error.message,
                    stack: error.stack,
                },
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
