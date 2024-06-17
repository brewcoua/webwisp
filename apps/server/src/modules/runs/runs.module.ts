import { Module } from '@nestjs/common'

import { BrowserModule } from '../../services/browser'
import { MindModule } from '../../services/mind'

import RunsController from './runs.controller'
import RunsService from './runs.service'
import RunsGateway from './runs.gateway'

@Module({
    imports: [BrowserModule, MindModule],
    controllers: [RunsController],
    providers: [RunsService, RunsGateway],
})
export default class RunsModule {}
