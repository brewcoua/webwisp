import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject, NotFoundException } from '@nestjs/common'
import { Err, Ok, Result } from 'oxide.ts'
import { existsSync, rmSync } from 'fs'

import { TASK_REPOSITORY } from '../../tasks.tokens'
import { DeleteTaskCommand } from './delete-task.command'
import { TaskRepositoryPort } from '../../database/repositories/task.repository.port'

@CommandHandler(DeleteTaskCommand)
export class DeleteTaskService implements ICommandHandler<DeleteTaskCommand> {
    constructor(
        @Inject(TASK_REPOSITORY)
        private readonly taskRepository: TaskRepositoryPort
    ) {}

    async execute(command: DeleteTaskCommand): Promise<Result<void, Error>> {
        const result = await this.taskRepository.deleteById(command.task_id)
        if (!result) {
            return Err(
                new NotFoundException(
                    `Task with id ${command.task_id} not found`
                )
            )
        }

        // Now let's check if it has a trace leftover
        if (existsSync(`/data/traces/${command.task_id}.zip`)) {
            // If it does, let's delete it
            try {
                rmSync(`/data/traces/${command.task_id}.zip`)
            } catch (error) {
                return Err(
                    new Error(
                        `Failed to delete trace for task with id ${command.task_id}`
                    )
                )
            }
        }

        return Ok(undefined)
    }
}
