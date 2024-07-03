import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import { Ok, Result } from 'oxide.ts'

import { CreateTaskGroupCommand } from './create-group.command'
import { TASK_GROUP_REPOSITORY } from '../../tasks.tokens'
import { TaskGroupRepositoryPort } from '../../database/repositories/group.repository.port'
import TaskGroupEntity from '../../domain/group.entity'

@CommandHandler(CreateTaskGroupCommand)
export class CreateTaskGroupService
    implements ICommandHandler<CreateTaskGroupCommand>
{
    constructor(
        @Inject(TASK_GROUP_REPOSITORY)
        private readonly taskGroupRepository: TaskGroupRepositoryPort
    ) {}

    async execute(
        command: CreateTaskGroupCommand
    ): Promise<Result<TaskGroupEntity, Error>> {
        const group = TaskGroupEntity.create({
            name: command.name,
        })

        await this.taskGroupRepository.insert(group)

        return Ok(group)
    }
}
