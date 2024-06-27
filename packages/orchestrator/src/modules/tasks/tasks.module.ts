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

import { CreateTaskHttpController } from './commands/create-task/create-task.http.controller'
import { CreateTaskService } from './commands/create-task/create-task.service'
import { DeleteTaskHttpController } from './commands/delete-task/delete-task.http.controller'
import { DeleteTaskService } from './commands/delete-task/delete-task.service'

import { GetTaskHttpController } from './queries/get-task/get-task.http.controller'
import { GetTaskQueryHandler } from './queries/get-task/get-task.query-handler'
import { SubscribeHttpController } from './queries/subscribe/subscribe.http.controller'
import { GetTraceHttpController } from './queries/get-trace/get-trace.http.controller'
import { GetTraceQueryHandler } from './queries/get-trace/get-trace.query-handler'
import { GetTasksHttpController } from './queries/get-tasks/get-tasks.http.controller'
import { GetTasksQueryHandler } from './queries/get-tasks/get-tasks.query-handler'
import { ViewerHttpController } from './queries/viewer/viewer.http.controller'

const HttpControllers = [
    CreateTaskHttpController,
    GetTaskHttpController,
    SubscribeHttpController,
    GetTraceHttpController,
    DeleteTaskHttpController,
    GetTasksHttpController,
    ViewerHttpController,
]

const CommandHandlers: Provider[] = [CreateTaskService, DeleteTaskService]
const QueryHandlers: Provider[] = [
    GetTaskQueryHandler,
    GetTraceQueryHandler,
    GetTasksQueryHandler,
]

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
    controllers: [TasksController, ...HttpControllers],
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
