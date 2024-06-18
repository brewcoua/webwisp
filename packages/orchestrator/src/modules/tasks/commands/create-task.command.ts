import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs'
import { Logger } from '@nestjs/common'
import { nanoid } from 'nanoid'
import { PartialTask } from '@webwisp/types/tasks'

import QueueService from '../services/queue'

export default class CreateTaskCommand implements ICommand {
    constructor(public readonly task: PartialTask) {}
}

@CommandHandler(CreateTaskCommand)
export class CreateTaskHandler implements ICommandHandler<CreateTaskCommand> {
    constructor(private readonly queueService: QueueService) {}

    async execute(command: CreateTaskCommand): Promise<string> {
        const id = nanoid()

        this.queueService.push({
            ...command.task,
            id,
            createdAt: new Date(),
        })

        Logger.verbose(`Created task with id: ${id}`, 'CreateTaskHandler')

        return Promise.resolve(id)
    }
}
