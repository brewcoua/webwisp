import { Module } from '@nestjs/common'

import RunsController from './runs.controller'
import RunsService from './runs.service'
import RunsGateway from './runs.gateway'

@Module({
    controllers: [RunsController],
    providers: [RunsService, RunsGateway],
})
export default class RunsModule {}
