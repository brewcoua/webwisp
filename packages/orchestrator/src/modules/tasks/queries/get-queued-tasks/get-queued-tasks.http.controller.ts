import { Controller, Get, HttpStatus, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger'

import TasksMapper from '../../tasks.mapper'
import TaskResponseDto from '@modules/tasks/dtos/task.response.dto'
import { Scopes } from '@modules/auth'
import { UserScopes } from '@modules/auth/domain/user.types'
import { GetQueuedTasksRequestDto } from './get-queued-tasks.request.dto'
import { GetQueuedTasksQuery } from './get-queued-tasks.query'
import { Result, match } from 'oxide.ts'
import TaskEntity from '@modules/tasks/domain/task.entity'

@ApiTags('tasks')
@Controller('tasks')
export class GetQueuedTasksHttpController {
    constructor(
        private readonly queryBus: QueryBus,
        private readonly mapper: TasksMapper
    ) {}

    @ApiOperation({
        summary: 'Get queued tasks',
        description: 'Get queued tasks list',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Queued tasks list',
        type: [TaskResponseDto],
    })
    @ApiBearerAuth()
    @Scopes(UserScopes.VIEW)
    @Get('queued')
    async getQueuedTasks(
        @Query() params: GetQueuedTasksRequestDto
    ): Promise<TaskResponseDto[]> {
        const query = new GetQueuedTasksQuery(params)

        const result: Result<TaskEntity[], Error> =
            await this.queryBus.execute(query)

        return match(result, {
            Ok: (tasks) => tasks.map((task) => this.mapper.toResponse(task)),
            Err: (error) => {
                throw error
            },
        })
    }
}
