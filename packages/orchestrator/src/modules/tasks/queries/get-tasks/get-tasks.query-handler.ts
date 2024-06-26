import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import { Ok, Result } from 'oxide.ts'

import { MatchQueryParams, Paginated } from '@domain/ddd'

import { GetTasksQuery } from './get-tasks.query'
import { TASK_REPOSITORY } from '../../tasks.tokens'
import { TaskRepositoryPort } from '../../database/repositories/task.repository.port'
import TaskEntity from '../../domain/task.entity'

@QueryHandler(GetTasksQuery)
export class GetTasksQueryHandler implements IQueryHandler<GetTasksQuery> {
    constructor(
        @Inject(TASK_REPOSITORY)
        private readonly taskRepository: TaskRepositoryPort
    ) {}

    async execute(
        query: GetTasksQuery
    ): Promise<Result<Paginated<TaskEntity>, Error>> {
        const { status, target, prompt, ...params } = query

        const matches: MatchQueryParams[] = []
        if (status) matches.push({ key: 'status', query: status })
        if (target) matches.push({ key: 'target', query: target })
        if (prompt) matches.push({ key: 'prompt', query: prompt })

        const tasks = await this.taskRepository.findAllPaginated(
            params,
            matches
        )

        return Ok(tasks)
    }
}
