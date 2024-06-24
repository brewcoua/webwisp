import {
    Controller,
    Post,
    Body,
    HttpCode,
    Get,
    InternalServerErrorException,
} from '@nestjs/common'
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger'
import { nanoid } from 'nanoid'
import { EventEmitter2 } from '@nestjs/event-emitter'

import { CreateTaskDto, TaskIdDto } from './dtos'

import { WorkersService } from '@modules/workers'
import { TaskResultEntity } from '@modules/workers/domain/TaskResult'

@ApiTags('tasks')
@ApiBearerAuth()
@Controller('tasks')
export default class TasksController {
    constructor(
        private readonly eventEmitter: EventEmitter2,
        private readonly workersService: WorkersService
    ) {}

    @Post()
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
    create(@Body() createTaskDto: CreateTaskDto) {
        const id = nanoid()
        const result = this.workersService.publishTask({
            id,
            createdAt: new Date(),
            target: createTaskDto.target,
            prompt: createTaskDto.prompt,
        })

        if (result) {
            return { id }
        }
        throw new InternalServerErrorException(
            'Failed to create task due to an internal error'
        )
    }

    @Get('results')
    @ApiOperation({
        summary: 'Get all task results',
        description: 'Returns a list of all task results',
    })
    @ApiResponse({
        status: 200,
        description: 'List of task results',
        type: TaskResultEntity,
        isArray: true,
    })
    getResults() {
        return this.workersService.getResults()
    }
}
