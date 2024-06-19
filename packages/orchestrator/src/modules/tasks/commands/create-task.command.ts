import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs'
import { Logger } from '@nestjs/common'
import { nanoid } from 'nanoid'
import { PartialTask } from '@webwisp/types/tasks'

import TasksService from '../tasks.service'

export default class CreateTaskCommand implements ICommand {
    constructor(public readonly task: PartialTask) {}
}

@CommandHandler(CreateTaskCommand)
export class CreateTaskHandler implements ICommandHandler<CreateTaskCommand> {
    constructor(private readonly tasksService: TasksService) {}

    async execute(command: CreateTaskCommand): Promise<string> {
        const id = nanoid()

        const result = this.tasksService.publish({
            ...command.task,
            id,
            createdAt: new Date(),
        })

        if (!result) {
            Logger.error(
                `Failed to publish task with id: ${id}`,
                'CreateTaskHandler'
            )
            throw new Error('Failed to publish task')
        }

        Logger.verbose(`Created task with id: ${id}`, 'CreateTaskHandler')
        return id
    }
}
