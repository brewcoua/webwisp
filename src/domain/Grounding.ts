import { PlaywrightService } from '../services/Playwright.service'
import { ElementHandle, Page } from 'playwright'
import { Option } from 'oxide.ts'

export abstract class Grounding {
    constructor(
        protected readonly page: Page,
        protected readonly pw: PlaywrightService,
    ) { }

    abstract resolve(...args: any[]): Promise<Option<ElementHandle>>;
}