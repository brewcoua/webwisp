import { PlaywrightService } from '../services/Playwright.service'
import { ElementHandle, Page } from 'playwright'
import { Option } from 'oxide.ts'
import { Logger } from 'pino'

import { Methods } from './Public'
import { VisualGrounding } from '../grounding/Visual.grounding'
import { AttributesGrounding } from '../grounding/Attributes.grounding'


export abstract class Grounding {
    constructor(
        protected readonly page: Page,
        protected readonly logger: Logger,
    ) { }

    abstract resolve(...args: any[]): Promise<Option<ElementHandle>>;
}

export class GroundingFactory {
    public static create(method: Methods, page: Page, logger: Logger): Grounding {
        logger = logger.child({ task: 'grounding', method: method })
        switch (method) {
            case Methods.Visual:
                return new VisualGrounding(page, logger)
            case Methods.Attributes:
                return new AttributesGrounding(page, logger)
        }
    }
}