import { Module } from '@nestjs/common'

import BrowserService from './browser.service'

@Module({
    providers: [BrowserService],
    exports: [BrowserService],
})
export default class BrowserModule {
    constructor(private readonly browserService: BrowserService) {}

    async onApplicationBootstrap() {
        await this.browserService.initialize()
    }

    async onApplicationShutdown() {
        await this.browserService.destroy()
    }
}
