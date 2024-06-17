import { BrowserContext } from 'playwright'
import { Logger } from '@nestjs/common'

import PageWrapper from './page.wrapper'
import config from '../browser.config'
import { Contexts } from 'apps/server/src/constants'

export default class ContextWrapper {
    private readonly pages: PageWrapper[] = []

    constructor(private readonly context: BrowserContext) {}

    public async destroy(): Promise<void> {
        try {
            await Promise.all(this.pages.map((page) => page?.destroy()))
            await this.context?.close()
            return
        } catch (error: any) {
            Logger.error(
                `Failed to gracefully close context`,
                error.stack,
                Contexts.ContextWrapper
            )
            return
        }
    }

    public async detach(url?: string): Promise<PageWrapper> {
        try {
            const page = await this.context.newPage()
            const id = this.pages.length + 1

            Logger.debug(
                `Created new page with id ${id}${url ? ` and url ${url}` : ''}`,
                Contexts.ContextWrapper
            )

            if (url) {
                await page.goto(url, {
                    waitUntil: 'load',
                })
                Logger.verbose(
                    `Navigated to url: ${url}`,
                    `${Contexts.ContextWrapper}/${Contexts.PageWrapper(id)}`
                )
            }

            if (config.viewport) {
                await page.setViewportSize(config.viewport)
                Logger.verbose(
                    `Set viewport size to ${config.viewport.width}x${config.viewport.height}`,
                    `${Contexts.ContextWrapper}/${Contexts.PageWrapper(id)}`
                )
            }

            const pageWrap = new PageWrapper(id, page)
            this.pages.push(pageWrap)

            await pageWrap.waitToLoad()
            await pageWrap.initialize()

            Logger.verbose(
                `Page wrapper initialized`,
                `${Contexts.ContextWrapper}/${Contexts.PageWrapper(id)}`
            )

            return pageWrap
        } catch (error: any) {
            Logger.error(
                `Failed to create page wrapper`,
                error.stack,
                Contexts.ContextWrapper
            )
            throw new Error('Failed to create page: ' + error)
        }
    }
}
