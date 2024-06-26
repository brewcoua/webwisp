import { Controller, Get, HttpStatus, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger'
import { Result, match } from 'oxide.ts'

import { Paginated } from '@domain/ddd'

import TasksMapper from '../../tasks.mapper'
import { GetTasksRequestDto } from './get-tasks.request.dto'
import { TaskPaginatedResponseDto } from '@modules/tasks/dtos/task.paginated.response.dto'
import { GetTasksQuery } from './get-tasks.query'
import TaskEntity from '../../domain/task.entity'

import { Scopes } from '@modules/auth'
import { UserScopes } from '@modules/auth/domain/user.types'

@ApiTags('tasks')
@Controller('tasks')
export class GetTasksHttpController {
    constructor(
        private readonly queryBus: QueryBus,
        private readonly mapper: TasksMapper
    ) {}

    @ApiOperation({
        summary: 'Get tasks',
        description: 'Get tasks list',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Tasks list',
        type: TaskPaginatedResponseDto,
    })
    @ApiBearerAuth()
    @Scopes(UserScopes.VIEW)
    @Get()
    async getTasks(
        @Query() params: GetTasksRequestDto
    ): Promise<TaskPaginatedResponseDto> {
        const query = new GetTasksQuery(params)

        const result: Result<
            Paginated<TaskEntity>,
            Error
        > = await this.queryBus.execute(query)

        return match(result, {
            Ok: (paginated) =>
                new TaskPaginatedResponseDto({
                    ...paginated,
                    data: paginated.data.map((task) =>
                        this.mapper.toResponse(task)
                    ),
                }),
            Err: (error) => {
                throw error
            },
        })
    }
}
