import { Service } from '../domain/Service'
import { useConfig } from '../hooks'

import { Logger } from 'pino'
import { Browser, chromium, ElementHandle, firefox, Locator, Page } from 'playwright'
import { None, Option, Some } from 'oxide.ts'

export type ClickableElement = 'button' | 'link' | 'input' | 'dropdown';

export class PlaywrightService extends Service {
    private browser!: Browser
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
    }

    public async destroy(): Promise<void> {
        for (const page of this.pages) {
            await page.close()
        }
        await this.browser.close()
    }

    public async make_page(url?: string): Promise<number> {
        const page = await this.browser.newPage()
        if (url) {
            await page.goto(url)
        }

        const config = useConfig()
        if (config.browser.viewport) {
            await page.setViewportSize(config.browser.viewport)
        }

        this.pages.push(page)

        return this.pages.length - 1
    }

    public async goto(pageIndex: number, url: string) {
        await this.pages[pageIndex].goto(url)
    }

    public async url(pageIndex: number): Promise<string> {
        return this.pages[pageIndex].url()
    }

    public async screenshot(pageIndex: number): Promise<string> {
        const buf = await this.pages[pageIndex].screenshot()
        return `data:image/png;base64,${buf.toString('base64')}`
    }

    public async resolve_element(pageIndex: number, role: ClickableElement, text: string): Promise<Option<ElementHandle>> {
        const page = this.pages[pageIndex]
        let element = null

        switch (role) {
            case 'button':
                element = await page.getByRole('button', { name: text }).elementHandle()
                break
            case 'link':
                element = await page.getByRole('link', { name: text }).elementHandle()
                break
            case 'input':
                const ways = [
                    () => page.getByPlaceholder(text).elementHandle(),
                    () => page.getByLabel(text).elementHandle(),
                    () => page.getByRole('textbox', { name: text }).elementHandle()
                ]

                for (const way of ways) {
                    element = await way()
                    if (element) break
                }
                break
            case 'dropdown':
                element = await page.getByRole('combobox', { name: text }).elementHandle()
                break
        }

        return element ? Some(element) : None
    }
}