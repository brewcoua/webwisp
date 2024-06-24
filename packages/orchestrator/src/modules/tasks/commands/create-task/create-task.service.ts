import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import { Err, Ok, Result } from 'oxide.ts'

import { CreateTaskCommand } from './create-task.command'
import TaskEntity from '../../domain/task.entity'
import { TaskStatus } from '../../domain/task.types'

import { TASK_QUEUES_REPOSITORY } from '../../tasks.tokens'
import { TaskQueuesRepositoryPort } from '../../database/repositories/queues.repository.port'

@CommandHandler(CreateTaskCommand)
export class CreateTaskService implements ICommandHandler<CreateTaskCommand> {
    constructor(
        @Inject(TASK_QUEUES_REPOSITORY)
        private readonly taskQueuesRepository: TaskQueuesRepositoryPort
    ) {}

    async execute(command: CreateTaskCommand): Promise<Result<string, Error>> {
        const task = TaskEntity.create({
            target: command.target,
            prompt: command.prompt,
            status: TaskStatus.PENDING,

            cycles: [],
        })

        const result = this.taskQueuesRepository.sendTaskToQueue(task)

        if (!result) {
            return Err(new Error('Failed to publish task'))
        }
        return Ok(task.id)
    }
}
