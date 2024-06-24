import { Injectable, Logger } from '@nestjs/common'
import amqp from 'amqplib'

import { RabbitMQService } from '@services/rabbitmq'
import { MessageQueues } from '@configs/app.const'

import { TaskQueuesRepositoryPort } from './queues.repository.port'
import TaskEntity from '../../domain/task.entity'
import { TaskEvent } from '../../domain/task.events'

@Injectable()
export default class TaskQueuesRepository implements TaskQueuesRepositoryPort {
    private tasksQueue: amqp.Channel | null = null
    private eventsQueue: amqp.Channel | null = null

    constructor(private readonly rabbitMQService: RabbitMQService) {}

    async connect(): Promise<void> {
        this.tasksQueue = await this.rabbitMQService.getQueue(
            MessageQueues.Tasks
        )
        this.eventsQueue = await this.rabbitMQService.getQueue(
            MessageQueues.TaskEvents
        )
    }

    sendTaskToQueue(task: TaskEntity): boolean {
        if (!this.tasksQueue) {
            throw new Error('Channel not initialized')
        }

        const props = task.getProps()

        const result = this.tasksQueue.sendToQueue(
            MessageQueues.Tasks,
            Buffer.from(
                JSON.stringify({
                    id: task.id,
                    target: props.target,
                    prompt: props.prompt,
                })
            )
        )

        if (result) {
            Logger.log(`Task published: ${task.id}`)
        }

        return result
    }

    bindEvents(handler: (event: TaskEvent) => void): void {
        if (!this.eventsQueue) {
            throw new Error('Channel not initialized')
        }

        this.eventsQueue.consume(
            MessageQueues.TaskEvents,
            (message) => {
                if (!message) {
                    return
                }

                const event: TaskEvent = JSON.parse(message.content.toString())
                handler(event)
            },
            { noAck: true }
        )
    }
}
