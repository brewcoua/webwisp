import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject, NotFoundException } from '@nestjs/common'
import { Err, Ok, Result } from 'oxide.ts'
import { existsSync, rmSync } from 'fs'

import { TASK_REPOSITORY, TRACES_REPOSITORY } from '../../tasks.tokens'
import { DeleteTaskCommand } from './delete-task.command'
import { TaskRepositoryPort } from '../../database/repositories/task.repository.port'
import { TracesRepositoryPort } from '../../database/repositories/traces.repository.port'

@CommandHandler(DeleteTaskCommand)
export class DeleteTaskService implements ICommandHandler<DeleteTaskCommand> {
    constructor(
        @Inject(TASK_REPOSITORY)
        private readonly taskRepository: TaskRepositoryPort,
        @Inject(TRACES_REPOSITORY)
        private readonly tracesRepository: TracesRepositoryPort
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

        await this.tracesRepository.deleteTrace(command.task_id)

        return Ok(undefined)
    }
}
