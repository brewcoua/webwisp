import { Controller, Get, Post, Body, HttpCode } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

import { CreateTaskDto, TaskIdDto } from './dtos'
import { CreateTaskCommand } from './commands'

@Controller('tasks')
export default class TasksController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) {}

    @Post('create')
    @HttpCode(201)
    @ApiOperation({
        summary: 'Create a new task',
        description: 'Creates a new task with the specified target and prompt',
    })
    @ApiResponse({
        status: 201,
        description: 'Task created',
        type: TaskIdDto,
    })
    async create(@Body() createTaskDto: CreateTaskDto) {
        const id: string = await this.commandBus.execute(
            new CreateTaskCommand(createTaskDto)
        )

        return { id }
    }
}
