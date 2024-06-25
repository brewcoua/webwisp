import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import { Result } from 'oxide.ts'

import { GetWorkersQuery } from './get-workers.query'
import { WORKER_QUEUES_REPOSITORY } from '../../workers.tokens'
import { WorkerQueuesRepositoryPort } from '../../database/repositories/queues.repository.port'
import WorkerEntity from '../../domain/worker.entity'

@QueryHandler(GetWorkersQuery)
export class GetWorkersQueryHandler implements IQueryHandler<GetWorkersQuery> {
    constructor(
        @Inject(WORKER_QUEUES_REPOSITORY)
        private readonly workerQueuesRepository: WorkerQueuesRepositoryPort
    ) {}

    async execute(query: GetWorkersQuery): Promise<WorkerEntity[]> {
        const workers = this.workerQueuesRepository.getWorkers()
        return workers
    }
}
