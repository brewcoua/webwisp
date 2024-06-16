import { Inject, Injectable } from '@nestjs/common'
import { Logger } from 'winston'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'

import MindModel from './models/mind.model'
import MindModelFactory from './models/mind.model-factory'
import config from './mind.config'
import MindTransformer from './mind.transformer'
import MindParser from './mind.parser'

@Injectable()
export default class MindService {
    public readonly model: MindModel<unknown>
    public readonly transformer = new MindTransformer()
    public readonly parser = new MindParser()
    private readonly logger: Logger

    constructor(@Inject(WINSTON_MODULE_PROVIDER) logger: Logger) {
        this.logger = logger.child({ service: 'Mind' })
        this.model = MindModelFactory.makeModel(config.type)
    }
}
