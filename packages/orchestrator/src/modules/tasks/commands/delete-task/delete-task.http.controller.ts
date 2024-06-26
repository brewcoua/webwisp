import { Controller, Delete, HttpStatus, Param } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger'
import { Result, match } from 'oxide.ts'

import { DeleteTaskCommand } from './delete-task.command'
import { Scopes } from '@modules/auth'
import { UserScopes } from '@modules/auth/domain/user.types'

@ApiTags('tasks')
@Controller('tasks')
export class DeleteTaskHttpController {
    constructor(private readonly commandBus: CommandBus) {}

    @ApiOperation({
        summary: 'Delete a task',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Task deleted',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Task not found',
    })
    @ApiBearerAuth()
    @Scopes(UserScopes.EDIT)
    @Delete(':task_id')
    async deleteTask(@Param('task_id') task_id: string): Promise<void> {
        const result: Result<void, Error> = await this.commandBus.execute(
            new DeleteTaskCommand({ task_id })
        )

        return match(result, {
            Ok: () => {},
            Err: (error) => {
                throw error
            },
        })
    }
}
