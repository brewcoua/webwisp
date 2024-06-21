import { Module } from '@nestjs/common'

import TasksController from './tasks.controller'

@Module({
    controllers: [TasksController],
    providers: [],
})
export default class TasksModule {}
