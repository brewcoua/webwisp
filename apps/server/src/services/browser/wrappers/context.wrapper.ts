import { BrowserContext } from 'playwright'
import { Logger } from 'winston'

import PageWrapper from './page.wrapper'
import config from '../browser.config'

export default class ContextWrapper {
    private readonly pages: PageWrapper[] = []

    constructor(
        private readonly context: BrowserContext,
        private readonly logger: Logger
    ) {}

    public async destroy(): Promise<void> {
        try {
            await Promise.all(this.pages.map((page) => page?.destroy()))
            await this.context?.close()
            return
        } catch (error: any) {
            this.logger.warn(`Failed to gracefully close context`, {
                error: {
                    message: error.message,
                    stack: error.stack,
                },
            })
            return
        }
    }

    public async detach(url?: string): Promise<PageWrapper> {
        try {
            const page = await this.context.newPage()
            if (url) {
                await page.goto(url, {
                    waitUntil: 'load',
                })
            }

            if (config.viewport) await page.setViewportSize(config.viewport)

            const pageWrap = new PageWrapper(
                page,
                this.logger.child({
                    wrapper: 'Page',
                    page: this.pages.length,
                })
            )
            this.pages.push(pageWrap)

            await pageWrap.waitToLoad()
            await pageWrap.initialize()

            return pageWrap
        } catch (error: any) {
            this.logger.error(`Failed to create page`, {
                error: {
                    message: error.message,
                    stack: error.stack,
                },
            })
            throw new Error('Failed to create page: ' + error)
        }
    }
}
