import { MessageQueues } from '@configs/app.const'
import { useEnv } from '@configs/env'
import { TaskEvent, TaskEventType } from '@services/exec/domain/task.events'
import { CreateTaskProps } from '@services/exec/domain/task.types'
import {
    PartialWorkerEvent,
    WorkerEventType,
} from '@services/exec/domain/worker.events'
import amqp from 'amqplib'

import { Logger } from 'winston'

export default class RabbitMQService {
    private connection: amqp.Connection | null = null

    public tasksQueue: amqp.Channel | null = null
    public taskEventsQueue: amqp.Channel | null = null
    public workerEventsQueue: amqp.Channel | null = null

    private readonly logger: Logger

    constructor(
        private readonly id: string,
        logger: Logger
    ) {
        this.logger = logger.child({
            context: 'RabbitMQService',
        })
    }

    async initialize() {
        const username = useEnv('RABBITMQ_DEFAULT_USER'),
            password = useEnv('RABBITMQ_DEFAULT_PASS')
        if (username && password) {
            this.connection = await amqp.connect(
                `amqp://${username}:${encodeURIComponent(password)}@rabbitmq`
            )
        } else {
            this.connection = await amqp.connect(`amqp://rabbitmq`)
        }

        this.tasksQueue = await this.createChannel()
        await this.createQueue(this.tasksQueue, MessageQueues.Tasks)

        this.taskEventsQueue = await this.createChannel()
        await this.createQueue(this.taskEventsQueue, MessageQueues.TaskEvents)

        this.workerEventsQueue = await this.createChannel()
        await this.createQueue(
            this.workerEventsQueue,
            MessageQueues.WorkerEvents
        )

        this.logger.info('RabbitMQService initialized')
    }

    async close() {
        if (this.tasksQueue) {
            await this.tasksQueue.close()
        }
        if (this.workerEventsQueue) {
            this.emitWorkerEvent({
                type: WorkerEventType.DISCONNECTED,
            })
            await this.workerEventsQueue.close()
        }
        if (this.taskEventsQueue) {
            await this.taskEventsQueue.close()
        }

        if (this.connection) {
            await this.connection.close()
        }

        this.logger.info('RabbitMQService closed')
    }

    private async createChannel() {
        if (!this.connection) {
            throw new Error('Connection is not initialized')
        }

        return this.connection.createChannel()
    }

    private async createQueue(channel: amqp.Channel, name: string) {
        return channel.assertQueue(name)
    }

    async bindTasks(callback: (task: CreateTaskProps) => void) {
        if (!this.tasksQueue) {
            throw new Error('Tasks queue is not initialized')
        }

        const consumer = await this.tasksQueue.consume('tasks', (msg) => {
            if (msg) {
                const task: CreateTaskProps = JSON.parse(msg.content.toString())

                try {
                    callback(task)
                    this.tasksQueue?.ack(msg)
                } catch (err: any) {
                    this.logger.error('Failed to process task', {
                        id: task.id,
                        error: {
                            message: err.message,
                            stack: err.stack,
                        },
                    })
                    this.emitTaskEvent({
                        type: TaskEventType.REQUEUED,
                        id: task.id,
                    })
                    this.tasksQueue?.nack(msg, false, true)
                }
            }
        })

        this.emitWorkerEvent({
            type: WorkerEventType.STARTED,
            worker: {
                id: this.id,
                tag: consumer.consumerTag,
            },
        })

        return this.tasksQueue
    }

    ackTask(msg: amqp.ConsumeMessage) {
        if (!this.tasksQueue) {
            throw new Error('Tasks queue is not initialized')
        }

        this.tasksQueue.ack(msg)
    }

    emitWorkerEvent(event: PartialWorkerEvent): boolean {
        if (!this.workerEventsQueue) {
            throw new Error('Events queue is not initialized')
        }

        return this.workerEventsQueue.sendToQueue(
            MessageQueues.WorkerEvents,
            Buffer.from(
                JSON.stringify({
                    ...event,
                    id: this.id,
                })
            )
        )
    }

    emitTaskEvent(event: TaskEvent): boolean {
        if (!this.taskEventsQueue) {
            throw new Error('Events queue is not initialized')
        }

        return this.taskEventsQueue.sendToQueue(
            MessageQueues.TaskEvents,
            Buffer.from(JSON.stringify(event))
        )
    }
}
