import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
} from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { Result, match } from 'oxide.ts'

import { ScopedJwtAuthGuard } from '@modules/auth'
import { UserScopes } from '@modules/auth/domain/user.types'

import { CreateTaskResponseDto } from './create-task.response.dto'
import { CreateTaskRequestDto } from './create-task.request.dto'
import { CreateTaskCommand } from './create-task.command'

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
    @UseGuards(ScopedJwtAuthGuard(UserScopes.EDIT))
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
