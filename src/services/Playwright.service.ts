import { Service } from '../domain/Service'
import { useConfig } from '../hooks'

import { Logger } from 'pino'
import { Browser, chromium, ElementHandle, firefox, Locator, Page } from 'playwright'
import { None, Option, Some } from 'oxide.ts'

export type ClickableElement = 'button' | 'link' | 'input' | 'dropdown';

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
    ) { }

    async destroy(): Promise<void> {
        await this.page.close()
    }

    private async resolve({ role, name }: { role: ClickableElement, name: string }): Promise<Option<ElementHandle>> {
        let element = null

        switch (role) {
            case 'button':
                element = await this.page.getByRole('button', { name }).elementHandle()
                break
            case 'link':
                element = await this.page.getByRole('link', { name }).elementHandle()
                break
            case 'input':
                const ways = [
                    () => this.page.getByLabel(name).elementHandle(),
                    () => this.page.getByRole('textbox', { name }).elementHandle()
                ]

                for (const way of ways) {
                    element = await way()
                    if (element) break
                }
                break
            case 'dropdown':
                element = await this.page.getByRole('combobox', { name }).elementHandle()
                break
        }

        return element ? Some(element) : None
    }

    public async getUrl(): Promise<string> {
        return this.page.url()
    }
    public async screenshot(): Promise<string> {
        const buf = await this.page.screenshot()
        return `data:image/png;base64,${buf.toString('base64')}`
    }


    public async click({ role, name }: { role: ClickableElement, name: string}): Promise<string> {
        const element = await this.resolve({ role, name });

        if (element.isNone()) {
            return 'Could not find element'
        } else {
            await element.unwrap().click()
            return 'Successfully clicked'
        }
    }

    public async type({ text, name }: { text: string, name: string }): Promise<string> {
        const element = await this.resolve({ role: 'input', name });

        if (element.isNone()) {
            return 'Could not find element'
        } else {
            await element.unwrap().fill(text)
            return 'Successfully typed'
        }
    }
}