import {
    Browser,
    BrowserContextOptions,
    LaunchOptions,
    chromium,
    firefox,
    webkit,
} from 'playwright'
import { BrowserType } from '../BrowserConfig'
import BrowserContextWrapper from './BrowserContextWrapper'

export default class BrowserWrapper {
    private readonly contexts: BrowserContextWrapper[] = []

    constructor(private readonly browser: Browser) {}

    public static async new(
        type: BrowserType,
        options?: LaunchOptions
    ): Promise<BrowserWrapper | null> {
        let browser: Browser
        try {
            switch (type) {
                case 'chromium':
                    browser = await chromium.launch(options)
                    break
                case 'firefox':
                    browser = await firefox.launch(options)
                    break
                case 'webkit':
                    browser = await webkit.launch(options)
                    break
                default:
                    return null
            }
            return new BrowserWrapper(browser)
        } catch (err) {
            return null
        }
    }

    public async destroy(): Promise<boolean> {
        try {
            await Promise.all(this.contexts.map((context) => context.destroy()))
            await this.browser.close()
            return true
        } catch (error) {
            return false
        }
    }

    public async makeContext(
        options?: BrowserContextOptions
    ): Promise<BrowserContextWrapper | null> {
        try {
            const context = await this.browser.newContext(options)
            this.contexts.push(new BrowserContextWrapper(context))
            return this.contexts[this.contexts.length - 1]
        } catch (error) {
            return null
        }
    }
}
