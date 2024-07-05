import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import { Ok, Result } from 'oxide.ts'

import { Paginated } from '@domain/ddd'

import { GetGroupsQuery } from './get-groups.query'
import { TASK_GROUP_REPOSITORY } from '../../tasks.tokens'
import { TaskGroupRepositoryPort } from '../../database/repositories/group.repository.port'
import TaskGroupEntity from '../../domain/group.entity'

@QueryHandler(GetGroupsQuery)
export class GetGroupsQueryHandler implements IQueryHandler<GetGroupsQuery> {
    constructor(
        @Inject(TASK_GROUP_REPOSITORY)
        private readonly taskGroupRepository: TaskGroupRepositoryPort
    ) {}

    async execute(
        query: GetGroupsQuery
    ): Promise<Result<Paginated<TaskGroupEntity>, Error>> {
        const groups = await this.taskGroupRepository.findAllPaginated(query)

        return Ok(groups)
    }
}
