import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger'
import { Result, match } from 'oxide.ts'

import { UserScopes } from '@modules/auth/domain/user.types'
import { Scopes } from '@modules/auth'

import { CreateTaskResponseDto } from './create-task.response.dto'
import { CreateTaskRequestDto } from './create-task.request.dto'
import { CreateTaskCommand } from './create-task.command'

@ApiTags('tasks')
@Controller('tasks')
export class CreateTaskHttpController {
    constructor(private readonly commandBus: CommandBus) {}

    @ApiOperation({
        summary: 'Create a new task',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Task created',
        type: CreateTaskResponseDto,
    })
    @ApiBearerAuth()
    @Scopes(UserScopes.EDIT)
    @HttpCode(HttpStatus.CREATED)
    @Post('create')
    async createTask(@Body() props: CreateTaskRequestDto) {
        const command = new CreateTaskCommand(props)
        const result: Result<string, Error> =
            await this.commandBus.execute(command)

        return match(result, {
            Ok: (taskId) => ({
                id: taskId,
            }),
            Err: (error) => {
                throw error
            },
        })
    }
}
