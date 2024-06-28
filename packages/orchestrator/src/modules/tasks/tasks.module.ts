import {
    Inject,
    Logger,
    Module,
    OnApplicationBootstrap,
    Provider,
} from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ServeStaticModule } from '@nestjs/serve-static'

import TasksMapper from './tasks.mapper'

import { Task, TaskSchema } from './database/models/task.model'

import { TasksController } from './tasks.controller'
import { TASK_QUEUES_REPOSITORY, TRACES_REPOSITORY } from './tasks.tokens'
import { TaskQueuesRepositoryPort } from './database/repositories/queues.repository.port'
import { TracesRepositoryPort } from './database/repositories/traces.repository.port'

import { Repositories } from './database/repositories'

import { QueryHandlers, QueryHttpControllers } from './queries'
import { CommandHandlers, CommandHttpControllers } from './commands'

const Mappers: Provider[] = [TasksMapper]

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Task.name,
                schema: TaskSchema,
            },
        ]),
        ServeStaticModule.forRoot({
            rootPath: '/data/traces',
            serveRoot: '/api/tasks/traces/local',
        }),
    ],
    controllers: [
        TasksController,
        ...CommandHttpControllers,
        ...QueryHttpControllers,
    ],
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
        private readonly taskQueueRepository: TaskQueuesRepositoryPort,
        @Inject(TRACES_REPOSITORY)
        private readonly tracesRepository: TracesRepositoryPort
    ) {}

    async onApplicationBootstrap() {
        await this.taskQueueRepository.connect()
        Logger.log('Task queues repository connected', 'TasksModule')

        await this.tracesRepository.uploadAll()
        Logger.log('All traces uploaded', 'TasksModule')
    }
}
