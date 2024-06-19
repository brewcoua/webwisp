import { Module } from '@nestjs/common'

import TasksController from './tasks.controller'
import TasksService from './tasks.service'
import QueueService from './services/queue'

import { RabbitMQModule } from './repositories/rabbitmq'

import { CancelTaskHandler, CreateTaskHandler } from './commands'

const commandHandlers = [CreateTaskHandler, CancelTaskHandler]

@Module({
    imports: [RabbitMQModule],
    controllers: [TasksController],
    providers: [TasksService, QueueService, ...commandHandlers],
})
export default class TasksModule {}
