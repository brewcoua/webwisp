import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger'

import { CreateTaskGroupRequestDto } from './create-group.request.dto'
import TaskGroupResponseDto from '../../dtos/group.response.dto'

import { Scopes } from '@modules/auth'
import { UserScopes } from '@modules/auth/domain/user.types'
import { CreateTaskGroupCommand } from './create-group.command'
import { Result, match } from 'oxide.ts'
import TaskGroupEntity from '@modules/tasks/domain/group.entity'
import TaskGroupMapper from '@modules/tasks/domain/group.mapper'

@ApiTags('tasks')
@Controller('tasks')
export class CreateTaskGroupHttpController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly mapper: TaskGroupMapper
    ) {}

    @ApiOperation({
        summary: 'Create a new task group',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Task group created successfully',
        type: TaskGroupResponseDto,
    })
    @ApiBearerAuth()
    @Scopes(UserScopes.EDIT)
    @HttpCode(HttpStatus.CREATED)
    @Post('group')
    async createGroup(@Body() props: CreateTaskGroupRequestDto) {
        const command = new CreateTaskGroupCommand(props)
        const result: Result<TaskGroupEntity, Error> =
            await this.commandBus.execute(command)

        return match(result, {
            Ok: (group) => this.mapper.toResponse(group),
            Err: (error) => {
                throw error
            },
        })
    }
}
