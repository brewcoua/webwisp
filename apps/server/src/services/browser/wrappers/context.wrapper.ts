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
            this.logger.debug(`Creating new page`, {
                id: this.pages.length,
            })
            const page = await this.context.newPage()
            this.logger.debug(`Created new page`, {
                id: this.pages.length,
            })

            if (url) {
                await page.goto(url, {
                    waitUntil: 'load',
                })
                this.logger.debug(`Navigated to url`, {
                    url,
                    id: this.pages.length,
                })
            }

            if (config.viewport) {
                await page.setViewportSize(config.viewport)
                this.logger.debug(`Set viewport size`, {
                    size: config.viewport,
                    id: this.pages.length,
                })
            }

            const pageWrap = new PageWrapper(
                page,
                this.logger.child({
                    wrapper: 'Page',
                    page: this.pages.length,
                })
            )
            this.pages.push(pageWrap)

            this.logger.debug(`Initializing page wrapper`, {
                id: this.pages.length,
            })

            await pageWrap.waitToLoad()
            await pageWrap.initialize()

            this.logger.debug(`Page wrapper initialized`, {
                id: this.pages.length,
            })

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
