import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import { Ok, Result } from 'oxide.ts'

import { MatchQueryParams, Paginated } from '@domain/ddd'

import { GetTasksQuery } from './get-tasks.query'
import { TASK_QUEUES_REPOSITORY, TASK_REPOSITORY } from '../../tasks.tokens'
import { TaskRepositoryPort } from '../../database/repositories/task.repository.port'
import TaskEntity from '../../domain/task.entity'
import { TaskQueuesRepositoryPort } from '../../database/repositories/queues.repository.port'

@QueryHandler(GetTasksQuery)
export class GetTasksQueryHandler implements IQueryHandler<GetTasksQuery> {
    constructor(
        @Inject(TASK_REPOSITORY)
        private readonly taskRepository: TaskRepositoryPort,
        @Inject(TASK_QUEUES_REPOSITORY)
        private readonly taskQueuesRepository: TaskQueuesRepositoryPort
    ) {}

    async execute(
        query: GetTasksQuery
    ): Promise<Result<Paginated<TaskEntity>, Error>> {
        const { status, target, prompt, group, ...params } = query

        // First, get all queued tasks (tasks not yet started, not saved to the database)
        const queuedTasks = this.taskQueuesRepository
            .getEnqueuedTasks()
            .filter((task) => {
                const props = task.getProps()

                if (group) {
                    if (props.group !== group) return false
                } else {
                    if (props.group) return false
                }

                if (status && props.status !== status) return false
                if (target && !props.target.includes(target)) return false
                if (prompt && !props.prompt.includes(prompt)) return false
                return true
            })

        // Now, depending on how many tasks are queued, the page size and offset
        // We offset the saved tasks from the pagination, with the enqueued tasks

        // First, check if it is necessary to query the database
        if (queuedTasks.length / params.limit > params.page) {
            const sliced = queuedTasks.slice(
                params.limit * (params.page - 1),
                params.limit * params.page
            )

            return Ok({
                data: sliced,
                count: sliced.length,
                page: params.page,
                limit: params.limit,
            })
        }

        const matches: MatchQueryParams[] = []
        if (status) matches.push({ key: 'status', query: status })
        if (target) matches.push({ key: 'target', query: target })
        if (prompt) matches.push({ key: 'prompt', query: prompt })

        // Calculate how many enqueued tasks we add at the beginning of the page
        const concatQueued = queuedTasks.slice(
            params.limit * (params.page - 1),
            params.limit * params.page
        )

        const limit = params.limit,
            page = params.page
        params.limit -= concatQueued.length
        params.page -= (queuedTasks.length - concatQueued.length) / params.limit

        const tasks = await this.taskRepository.findAllPaginatedByGroup(
            params,
            group,
            matches
        )

        const data = concatQueued.concat(tasks.data)

        return Ok({
            data,
            count: data.length,
            page,
            limit,
        })
    }
}
