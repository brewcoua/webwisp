import { Page, Browser, chromium, firefox } from 'playwright'
import { useConfig } from '../config'

export class BrowserHandler {
    private static instance: BrowserHandler;

    private browser: Browser;
    private page: Page;

    private constructor(browser: Browser, page: Page) {
        this.browser = browser;
        this.page = page;
    }

    public static async getInstance(): Promise<BrowserHandler> {
        if (!this.instance) {
            const params = await this._init();
            this.instance = new BrowserHandler(...params);
        }

        return this.instance
    }

    private static async _init(): Promise<[Browser, Page]> {
        const config = useConfig();

        let browser;
        switch (config.browser.type) {
            case 'chromium':
                browser = await chromium.launch(config.browser.options)
                break;
            case 'firefox':
                browser = await firefox.launch(config.browser.options)
                break;
        }

        const page = await browser.newPage()

        if (config.browser.viewport)
            await page.setViewportSize(config.browser.viewport)

        return [browser, page];
    }

    async goto(url: string) {
        await this.page.goto(url)
    }

    async screenshot(): Promise<Buffer> {
        return await this.page.screenshot()
    }

    async close() {
        await this.browser.close()
    }
}