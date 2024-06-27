import {
    ArgumentMetadata,
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    ParseArrayPipe,
    Post,
} from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger'
import { Result, match } from 'oxide.ts'

import { Scopes } from '@modules/auth'
import { UserScopes } from '@modules/auth/domain/user.types'

import { CreateTaskRequestDto } from '../create-task/create-task.request.dto'
import { BulkTasksCommand } from './bulk-tasks.command'
import { TasksArrayPipe } from './bulk-tasks.pipe'

@ApiTags('tasks')
@Controller('tasks')
export class BulkTasksHttpController {
    constructor(private readonly commandBus: CommandBus) {}

    @ApiOperation({
        summary: 'Create multiple tasks at once',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        type: [String],
        description: 'Tasks created successfully',
    })
    @ApiBody({
        type: CreateTaskRequestDto,
        isArray: true,
    })
    @ApiBearerAuth()
    @Scopes(UserScopes.EDIT)
    @HttpCode(HttpStatus.CREATED)
    @Post('bulk')
    async bulkTasks(
        @Body(new TasksArrayPipe({ max: 30, min: 1 }))
        tasks: CreateTaskRequestDto[]
    ): Promise<string[]> {
        const command = new BulkTasksCommand({
            tasks,
        })

        const result: Result<string[], Error> =
            await this.commandBus.execute(command)

        return match(result, {
            Ok: (tasks) => tasks,
            Err: (error) => {
                throw error
            },
        })
    }
}
