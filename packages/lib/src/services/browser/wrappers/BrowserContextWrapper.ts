import { BrowserContext } from 'playwright'
import { Logger } from 'winston'

import PageWrapper from './PageWrapper'
import config from '../BrowserConfig'

export default class BrowserContextWrapper {
    private readonly pages: PageWrapper[] = []

    constructor(
        private readonly context: BrowserContext,
        private readonly logger: Logger
    ) {}

    public async destroy(): Promise<boolean> {
        try {
            await Promise.all(this.pages.map((page) => page.destroy()))
            await this.context.close()
            return true
        } catch (error) {
            return false
        }
    }

    public async makePage(url?: string): Promise<PageWrapper | null> {
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
                    id: this.pages.length + 1,
                })
            )
            this.pages.push(pageWrap)

            await pageWrap.waitToLoad()
            await pageWrap.initialize()

            return pageWrap
        } catch (error) {
            return null
        }
    }
}
