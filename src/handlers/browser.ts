import { Page, Browser, chromium, firefox } from 'playwright'
import { useConfig } from '../config'
import * as fs from 'node:fs'

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

    async screenshot(): Promise<string> {
        await this.page.screenshot({ path: 'dist/tmp/screenshot.png' })
        const img = fs.readFileSync('dist/tmp/screenshot.png');
        const base64 = Buffer.from(img).toString('base64');
        fs.unlinkSync('dist/tmp/screenshot.png');
        return `data:image/png;base64,${base64}`;
    }

    async close() {
        await this.browser.close()
    }
}