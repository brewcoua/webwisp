import { BrowserContext } from 'playwright'
import { Logger } from 'winston'

import PageWrapper from './page.wrapper'
import config from '../browser.config'

export default class ContextWrapper {
    private readonly pages: PageWrapper[] = []
    private readonly logger: Logger

    constructor(
        private readonly context: BrowserContext,
        logger: Logger
    ) {
        this.logger = logger.child({
            context: 'ContextWrapper',
        })
    }

    public async destroy(): Promise<void> {
        try {
            await Promise.all(this.pages.map((page) => page?.destroy()))
            await this.context?.close()
            return
        } catch (error: any) {
            this.logger.error(`Failed to gracefully close context`, {
                stack: error.stack,
            })
            return
        }
    }

    public async detach(url?: string): Promise<PageWrapper> {
        try {
            const page = await this.context.newPage()
            const id = this.pages.length + 1

            this.logger.debug(
                `Created new page with id ${id}${url ? ` and url ${url}` : ''}`
            )

            if (url) {
                await page.goto(url, {
                    waitUntil: 'load',
                })
                this.logger.verbose(`Navigated to url: ${url}`, { id })
            }

            if (config.viewport) {
                await page.setViewportSize(config.viewport)
                this.logger.verbose(
                    `Set viewport size to ${config.viewport.width}x${config.viewport.height}`,
                    { id }
                )
            }

            const pageWrap = new PageWrapper(id, page, this.logger)
            this.pages.push(pageWrap)

            await pageWrap.waitToLoad()
            await pageWrap.initialize()

            this.logger.verbose(`Page wrapper initialized`, { id })

            return pageWrap
        } catch (error: any) {
            this.logger.error(`Failed to create page wrapper`, {
                stack: error.stack,
            })
            throw new Error('Failed to create page: ' + error)
        }
    }

    public async startTracing(id: string): Promise<void> {
        return this.context.tracing.start({
            name: id,
            screenshots: true,
            snapshots: true,
        })
    }

    public async stopTracing(id: string): Promise<void> {
        return this.context.tracing.stop({
            path: `/data/traces/${id}.zip`,
        })
    }
}
