import { Module } from '@nestjs/common'

import TasksController from './tasks.controller'
import QueueService from './services/queue'

import { CancelTaskHandler, CreateTaskHandler } from './commands'
import { GetTasksHandler } from './queries'

const commandHandlers = [CreateTaskHandler, CancelTaskHandler]
const queryHandlers = [GetTasksHandler]

@Module({
    controllers: [TasksController],
    providers: [QueueService, ...commandHandlers, ...queryHandlers],
})
export default class TasksModule {}
