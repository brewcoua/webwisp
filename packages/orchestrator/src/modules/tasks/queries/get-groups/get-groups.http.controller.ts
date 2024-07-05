import { Controller, Get, HttpStatus, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger'
import { match, Result } from 'oxide.ts'

import { Paginated } from '@domain/ddd'
import { Scopes } from '@modules/auth'
import { UserScopes } from '@modules/auth/domain/user.types'

import TaskGroupMapper from '../../domain/group.mapper'
import { TaskGroupPaginatedResponseDto } from '../../dtos/group.paginated.response.dto'
import { GetGroupsRequestDto } from './get-groups.request.dto'
import { GetGroupsQuery } from './get-groups.query'
import TaskGroupEntity from '../../domain/group.entity'

@ApiTags('tasks')
@Controller('tasks')
export class GetGroupsHttpController {
    constructor(
        private readonly queryBus: QueryBus,
        private readonly mapper: TaskGroupMapper
    ) {}

    @ApiOperation({
        summary: 'Get task groups',
        description: 'Get a list of task groups',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Task groups were successfully retrieved',
        type: TaskGroupPaginatedResponseDto,
    })
    @ApiBearerAuth()
    @Scopes(UserScopes.VIEW)
    @Get('groups')
    async getGroups(@Query() params: GetGroupsRequestDto) {
        const query = new GetGroupsQuery(params)
        const result: Result<
            Paginated<TaskGroupEntity>,
            Error
        > = await this.queryBus.execute(query)

        return match(result, {
            Ok: (paginated) =>
                new TaskGroupPaginatedResponseDto({
                    ...paginated,
                    data: paginated.data.map((group) =>
                        this.mapper.toResponse(group)
                    ),
                }),
            Err: (error) => {
                throw error
            },
        })
    }
}
