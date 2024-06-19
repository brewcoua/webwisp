import { Logger } from 'winston'

import MindModel from './models/mind.model'
import MindModelFactory from './models/mind.model-factory'
import config from './mind.config'
import MindTransformer from './mind.transformer'
import MindParser from './mind.parser'
import { ModelStatusType } from './domain/ModelStatus'

export default class MindService {
    public readonly model: MindModel<unknown>
    public readonly transformer = new MindTransformer()
    public readonly parser = new MindParser()

    private readonly logger: Logger

    constructor(logger: Logger) {
        this.model = MindModelFactory.makeModel(config.type)
        this.logger = logger.child({
            context: 'MindService',
        })
    }

    async initialize() {
        if (process.env.DISABLE_AUTH_CHECK === 'true') {
            return
        }

        const status = await this.model.verify()
        const statusObj = status.asObject()

        switch (statusObj.type) {
            case ModelStatusType.MISSING_MODEL:
                throw new Error(
                    `Model '${config.options.model}' is not available in the API. Please check the configuration of your token.`
                )
            case ModelStatusType.UNAUTHORIZED:
                throw new Error(
                    `Model API authorization failed with error: ${statusObj.error.message}`
                )
            case ModelStatusType.READY:
                this.logger.info(
                    `Model '${config.options.model}' is ready for use.`
                )
        }
    }
}
