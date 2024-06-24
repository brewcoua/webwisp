import {
    Inject,
    Module,
    OnApplicationBootstrap,
    Provider,
} from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import TasksMapper from './tasks.mapper'

import { Task, TaskSchema } from './database/models/task.model'

import { TASK_QUEUES_REPOSITORY } from './tasks.tokens'
import { TaskQueuesRepositoryPort } from './database/repositories/queues.repository.port'

import { CreateTaskHttpController } from './commands/create-task/create-task.http.controller'
import { CreateTaskService } from './commands/create-task/create-task.service'
import { Repositories } from './database/repositories'

const HttpControllers = [CreateTaskHttpController]

const CommandHandlers: Provider[] = [CreateTaskService]
const QueryHandlers: Provider[] = []

const Mappers: Provider[] = [TasksMapper]

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Task.name,
                schema: TaskSchema,
            },
        ]),
    ],
    controllers: [...HttpControllers],
    providers: [
        ...CommandHandlers,
        ...QueryHandlers,
        ...Mappers,
        ...Repositories,
    ],
})
export default class TasksModule implements OnApplicationBootstrap {
    constructor(
        @Inject(TASK_QUEUES_REPOSITORY)
        private readonly taskQueueRepository: TaskQueuesRepositoryPort
    ) {}

    async onApplicationBootstrap() {
        await this.taskQueueRepository.connect()
    }
}
