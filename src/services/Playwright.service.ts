import { Service } from '../domain/Service'
import { useConfig } from '../hooks'

import { Logger } from 'pino'
import { Browser, chromium, ElementHandle, firefox, Locator, Page } from 'playwright'



export class PlaywrightService extends Service {
    private browser!: Browser
    private pages: PageController[] = []

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
    }

    public async destroy(): Promise<void> {
        for (const page of this.pages) {
            await page.destroy()
        }
        await this.browser.close()
    }

    public async make_page(url?: string): Promise<PageController> {
        const page = await this.browser.newPage()
        if (url) {
            await page.goto(url)
        }

        const config = useConfig()
        if (config.browser.viewport) {
            await page.setViewportSize(config.browser.viewport)
        }

        const controller = new PageController(this, page)
        this.pages.push(controller)

        return controller
    }
}

export class PageController {
    constructor(
        private readonly pw: PlaywrightService,
        private readonly page: Page,
    ) {
    }

    async destroy(): Promise<void> {
        await this.page.close()
    }

    public async getUrl(): Promise<string> {
        return this.page.url()
    }

    public async
}