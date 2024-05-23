import { Service } from '../domain/Service'
import { useConfig } from '../hooks'

import { Logger } from 'pino'
import { Browser, BrowserContext, chromium, firefox, Page } from 'playwright'



export class PlaywrightService extends Service {
    private browser!: Browser
    private context!: BrowserContext
    private pages: Page[] = []

    constructor(logger: Logger) {
        super(
            logger.child({ service: 'playwright' }),
            'playwright',
        )
    }

    public async initialize(): Promise<void> {
        this.debug('Initializing Playwright service')

        const config = useConfig()

        switch (config.browser.type) {
            case 'chromium':
                this.browser = await chromium.launch(config.browser.options)
                break
            case 'firefox':
                this.browser = await firefox.launch(config.browser.options)
                break
        }

        this.context = await this.browser.newContext(config.browser.context)
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

        const config = useConfig()
        if (config.browser.viewport) {
            await page.setViewportSize(config.browser.viewport)
        }

        this.pages.push(page)

        return page
    }
}