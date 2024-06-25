import {
    Inject,
    Logger,
    Module,
    OnApplicationBootstrap,
    Provider,
} from '@nestjs/common'

import WorkersMapper from './workers.mapper'
import { Repositories } from './database/repositories'

import { WorkerQueuesRepositoryPort } from './database/repositories/queues.repository.port'
import { WORKER_QUEUES_REPOSITORY } from './workers.tokens'

import { GetWorkersHttpController } from './queries/get-workers/get-workers.http.controller'
import { SubscribeHttpController } from './queries/subscribe/subscribe.http.controller'

import { GetWorkersQueryHandler } from './queries/get-workers/get-workers.query-handler'

const HttpControllers = [GetWorkersHttpController, SubscribeHttpController]

const CommandHandlers: Provider[] = []
const QueryHandlers: Provider[] = [GetWorkersQueryHandler]

const Mappers: Provider[] = [WorkersMapper]

@Module({
    controllers: [...HttpControllers],
    providers: [
        ...CommandHandlers,
        ...QueryHandlers,
        ...Mappers,
        ...Repositories,
    ],
})
export default class WorkersModule implements OnApplicationBootstrap {
    constructor(
        @Inject(WORKER_QUEUES_REPOSITORY)
        private readonly workerQueueRepository: WorkerQueuesRepositoryPort
    ) {}

    async onApplicationBootstrap() {
        await this.workerQueueRepository.connect()
        Logger.log('Worker queues connected', 'WorkersModule')
    }
}
