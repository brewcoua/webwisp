import { Injectable } from '@nestjs/common'

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

    constructor() {
        this.model = MindModelFactory.makeModel(config.type)
    }
}
