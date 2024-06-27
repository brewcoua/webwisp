import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import { Err, Ok, Result } from 'oxide.ts'

import { BulkTasksCommand } from './bulk-tasks.command'

import { TASK_QUEUES_REPOSITORY } from '../../tasks.tokens'
import { TaskQueuesRepositoryPort } from '../../database/repositories/queues.repository.port'
import TaskEntity from '../../domain/task.entity'

@CommandHandler(BulkTasksCommand)
export class BulkTasksService implements ICommandHandler<BulkTasksCommand> {
    constructor(
        @Inject(TASK_QUEUES_REPOSITORY)
        private readonly taskQueuesRepository: TaskQueuesRepositoryPort
    ) {}

    async execute(command: BulkTasksCommand): Promise<Result<string[], Error>> {
        const tasks = command.tasks.map((task) => TaskEntity.create(task))

        const result = this.taskQueuesRepository.bulkSendTasks(tasks)

        if (!result) {
            return Err(new Error('Failed to send tasks'))
        }
        return Ok(tasks.map((task) => task.id))
    }
}
