import { Logger, Module } from '@nestjs/common'

import MindService from './mind.service'
import { ModelStatusType } from './domain/ModelStatus'
import config from './mind.config'
import { Contexts } from '../../constants'

@Module({
    providers: [MindService],
    exports: [MindService],
})
export default class MindModule {
    constructor(private readonly mindService: MindService) {}

    public async onApplicationBootstrap() {
        if (process.env.DISABLE_AUTH_CHECK === 'true') {
            return
        }

        const status = await this.mindService.model.verify()
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
                Logger.log(
                    `Model '${config.options.model}' is ready for use.`,
                    Contexts.MindModule
                )
        }
    }
}
