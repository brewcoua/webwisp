import Service from '@/domain/Service'

import MindModel from './models/MindModel'
import MindModelFactory from './models/MindModelFactory'
import config from './MindConfig'
import MindTransformer from './MindTransformer'
import MindParser from './MindParser'

export default class MindService extends Service {
    public readonly model: MindModel<unknown>
    public readonly transformer = new MindTransformer()
    public readonly parser = new MindParser()

    constructor() {
        super('Mind')
        this.model = MindModelFactory.makeModel(config.type)
    }
}
