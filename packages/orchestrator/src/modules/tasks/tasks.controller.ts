import {
    Controller,
    Get,
    Post,
    Body,
    HttpCode,
    Delete,
    Param,
    NotFoundException,
} from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger'
import { Task } from '@webwisp/types/tasks'

import TaskEntity from './domain/task.entity'
import { CancelTaskDto, CreateTaskDto, TaskIdDto } from './dtos'
import { CancelTaskCommand, CreateTaskCommand } from './commands'
import { GetTasksQuery } from './queries'

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

    @Delete(':id')
    @ApiParam({
        name: 'id',
        description: 'The ID of the task to cancel',
        example: 'SRjCIwzTLvAjKMMY59MY5',
    })
    @ApiOperation({
        summary: 'Cancel a task',
        description:
            'Cancels a task by ID, if it exists and is not already complete',
    })
    @ApiResponse({
        status: 200,
        description: 'Task canceled',
        type: TaskEntity,
    })
    @ApiResponse({
        status: 404,
        description: 'Task not found or already complete',
    })
    async cancel(@Param() cancelTaskDto: CancelTaskDto) {
        const task: Task | null = await this.commandBus.execute(
            new CancelTaskCommand(cancelTaskDto.id)
        )

        if (task) {
            return { task }
        }
        throw new NotFoundException()
    }

    @Get()
    @ApiOperation({
        summary: 'Get all tasks',
        description: 'Returns all tasks in the queue',
    })
    @ApiResponse({
        status: 200,
        description: 'Tasks returned',
        type: [TaskEntity],
    })
    async getAll() {
        return await this.queryBus.execute(new GetTasksQuery())
    }
}
