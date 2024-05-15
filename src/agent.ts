import { BrowserHandler } from './browser'
import { useConfig } from './config'

export class Agent {
    private static instance: Agent
    private browser: BrowserHandler

    private constructor(browser: BrowserHandler) {
        this.browser = browser
    }

    public static async getInstance(): Promise<Agent> {
        if (!this.instance) {
            const params = await this._init()
            this.instance = new Agent(...params)
        }

        return this.instance
    }

    private static async _init(): Promise<[BrowserHandler]> {
        const browser = await BrowserHandler.getInstance()

        return [browser]
    }

    private async wait(time: number) {
        return new Promise((resolve) => {
            setTimeout(resolve, time)
        })
    }

    async run() {
        const config = await useConfig();

        await this.browser.goto(config.target);

        await this.wait(5000);

        await this.browser.close();
    }
}