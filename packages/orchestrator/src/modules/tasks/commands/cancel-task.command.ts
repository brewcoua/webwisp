import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs'
import { Logger } from '@nestjs/common'
import { Task } from '@webwisp/types/tasks'

import QueueService from '../services/queue'

export default class CancelTaskCommand implements ICommand {
    constructor(public readonly id: string) {}
}

@CommandHandler(CancelTaskCommand)
export class CancelTaskHandler implements ICommandHandler<CancelTaskCommand> {
    constructor(private readonly queueService: QueueService) {}

    async execute(command: CancelTaskCommand): Promise<Task | null> {
        const task = this.queueService.remove(command.id)

        if (task) {
            Logger.verbose(
                `Cancelled task with id: ${command.id}`,
                'CancelTaskHandler'
            )
        }

        return Promise.resolve(task)
    }
}
