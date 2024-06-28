import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import { Ok, Result } from 'oxide.ts'

import { TASK_QUEUES_REPOSITORY } from '../../tasks.tokens'
import TaskEntity from '../../domain/task.entity'
import { GetQueuedTasksQuery } from './get-queued-tasks.query'
import { TaskQueuesRepositoryPort } from '../../database/repositories/queues.repository.port'

@QueryHandler(GetQueuedTasksQuery)
export class GetQueuedTasksQueryHandler
    implements IQueryHandler<GetQueuedTasksQuery>
{
    constructor(
        @Inject(TASK_QUEUES_REPOSITORY)
        private readonly taskQueuedRepository: TaskQueuesRepositoryPort
    ) {}

    async execute(
        query: GetQueuedTasksQuery
    ): Promise<Result<TaskEntity[], Error>> {
        const { status, target, prompt } = query

        const queuedTasks = this.taskQueuedRepository
            .getEnqueuedTasks()
            .filter((task) => {
                const props = task.getProps()
                if (status && props.status !== status) return false
                if (target && !props.target.includes(target)) return false
                if (prompt && !props.prompt.includes(prompt)) return false

                return true
            })

        return Ok(queuedTasks)
    }
}
