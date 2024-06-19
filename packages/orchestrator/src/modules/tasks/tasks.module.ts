import { Module } from '@nestjs/common'

import TasksController from './tasks.controller'
import TasksService from './tasks.service'
import QueueService from './services/queue'

import { RabbitMQModule } from './repositories/rabbitmq'

import { CreateTaskHandler } from './commands'

const commandHandlers = [CreateTaskHandler]

@Module({
    imports: [RabbitMQModule],
    controllers: [TasksController],
    providers: [TasksService, QueueService, ...commandHandlers],
})
export default class TasksModule {}
