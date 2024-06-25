import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Inject, NotFoundException } from '@nestjs/common'
import { Err, Ok, Result } from 'oxide.ts'

import { GetTaskQuery } from './get-task.query'
import { TASK_QUEUES_REPOSITORY, TASK_REPOSITORY } from '../../tasks.tokens'
import { TaskRepositoryPort } from '../../database/repositories/task.repository.port'
import { TaskQueuesRepositoryPort } from '../../database/repositories/queues.repository.port'
import TaskEntity from '../../domain/task.entity'

@QueryHandler(GetTaskQuery)
export class GetTaskQueryHandler implements IQueryHandler<GetTaskQuery> {
    constructor(
        @Inject(TASK_REPOSITORY)
        private readonly taskRepository: TaskRepositoryPort,
        @Inject(TASK_QUEUES_REPOSITORY)
        private readonly taskQueuesRepository: TaskQueuesRepositoryPort
    ) {}

    async execute(query: GetTaskQuery): Promise<Result<TaskEntity, Error>> {
        const task = await this.taskRepository.findOneById(query.id)
        if (task.isSome()) {
            return Ok(task.unwrap())
        }

        // Try finding it among the enqueued tasks
        const queuedTask = this.taskQueuesRepository.findTaskById(query.id)

        if (queuedTask) {
            return Ok(queuedTask)
        }

        return Err(new NotFoundException('Task not found'))
    }
}
