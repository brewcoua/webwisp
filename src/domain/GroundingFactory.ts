import { Page } from 'playwright'
import { Logger } from 'pino'

import { Methods } from './Public.d'

import { VisualGrounding } from '../grounding/Visual.grounding'
import { AttributesGrounding } from '../grounding/Attributes.grounding'
import { Grounding } from './Grounding'

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