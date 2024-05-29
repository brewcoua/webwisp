import { ElementHandle, Page } from 'playwright'
import { Option } from 'oxide.ts'

export abstract class Grounding {
    constructor(protected readonly page: Page) {}

    async initialize(): Promise<void> {
        return Promise.resolve()
    }

    abstract resolve(...args: any[]): Promise<Option<ElementHandle>>
}
