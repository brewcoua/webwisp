import { Browser, BrowserContext, chromium, firefox, Page } from 'playwright'

import { Service } from '../domain/Service'
import { CONFIG } from '../constants'
import { Logger } from '../logger'

export class PlaywrightService extends Service {
    private browser!: Browser
    private context!: BrowserContext
    private pages: Page[] = []

    constructor() {
        super('playwright')
    }

    public async initialize(): Promise<void> {
        Logger.debug('Initializing Playwright service')

        switch (CONFIG.browser.type) {
            case 'chromium':
                this.browser = await chromium.launch(CONFIG.browser.options)
                break
            case 'firefox':
                this.browser = await firefox.launch(CONFIG.browser.options)
                break
        }

        this.context = await this.browser.newContext(CONFIG.browser.context)
    }

    public async destroy(): Promise<void> {
        for (const page of this.pages) {
            await page.close()
        }
        await this.context.close()
        await this.browser.close()
    }

    public async make_page(url?: string): Promise<Page> {
        const page = await this.context.newPage()
        if (url) {
            await page.goto(url, {
                waitUntil: 'domcontentloaded',
            })
        }

        if (CONFIG.browser.viewport) {
            await page.setViewportSize(CONFIG.browser.viewport)
        }

        this.pages.push(page)

        return page
    }
}
