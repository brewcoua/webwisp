import { ElementHandle, Page } from 'playwright'
import { Option } from 'oxide.ts'
import { Logger } from 'pino'

export abstract class Grounding {
    constructor(
        protected readonly page: Page,
        protected readonly logger: Logger,
    ) { }

    async initialize(): Promise<void> {
        return Promise.resolve()
    }

    abstract resolve(...args: any[]): Promise<Option<ElementHandle>>;
}

