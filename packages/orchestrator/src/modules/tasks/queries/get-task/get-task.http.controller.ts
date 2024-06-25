import { Controller, Get, HttpStatus, Param } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger'
import { Result, match } from 'oxide.ts'

import { Scopes } from '@modules/auth'
import { UserScopes } from '@modules/auth/domain/user.types'

import TasksMapper from '../../tasks.mapper'
import TaskResponseDto from '../../dtos/task.response.dto'
import TaskEntity from '../../domain/task.entity'
import { GetTaskQuery } from './get-task.query'
import { GetTaskRequestDto } from './get-task.request.dto'

@ApiTags('tasks')
@Controller('tasks')
export class GetTaskHttpController {
    constructor(
        private readonly queryBus: QueryBus,
        private readonly mapper: TasksMapper
    ) {}

    @ApiOperation({ summary: 'Get task by id' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Current user',
        type: TaskResponseDto,
    })
    @ApiBearerAuth()
    @Scopes(UserScopes.VIEW)
    @Get('find/:id')
    async getTask(@Param() props: GetTaskRequestDto): Promise<TaskResponseDto> {
        const result: Result<TaskEntity, Error> = await this.queryBus.execute(
            new GetTaskQuery({
                id: props.id,
            })
        )

        return match(result, {
            Ok: (task) => this.mapper.toResponse(task),
            Err: (error) => {
                throw error
            },
        })
    }
}
