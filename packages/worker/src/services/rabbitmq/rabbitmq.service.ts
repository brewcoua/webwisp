import { WorkerEvent, WorkerEventType } from '@domain/WorkerEvent'
import amqp from 'amqplib'
import { Logger } from 'winston'

export default class RabbitMQService {
    private connection: amqp.Connection | null = null

    public tasksQueue: amqp.Channel | null = null
    public eventsQueue: amqp.Channel | null = null

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
        this.connection = await amqp.connect(
            `amqp://${process.env.RABBITMQ_HOST || 'localhost'}`
        )

        this.tasksQueue = await this.createChannel()
        await this.createQueue(this.tasksQueue, 'tasks')

        this.eventsQueue = await this.createChannel()
        await this.createQueue(this.eventsQueue, 'events')

        this.logger.info('RabbitMQService initialized')
        this.emitEvent({
            type: WorkerEventType.STARTED,
        })
    }

    async close() {
        if (this.tasksQueue) {
            await this.tasksQueue.close()
        }
        if (this.eventsQueue) {
            this.emitEvent({
                type: WorkerEventType.DISCONNECT,
            })
            await this.eventsQueue.close()
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

    async bindTasks(callback: (msg: amqp.ConsumeMessage) => void) {
        if (!this.tasksQueue) {
            throw new Error('Tasks queue is not initialized')
        }

        this.tasksQueue.consume('tasks', (msg) => {
            if (msg) {
                callback(msg)
            }
        })

        return this.tasksQueue
    }

    emitEvent(event: WorkerEvent): boolean {
        if (!this.eventsQueue) {
            throw new Error('Events queue is not initialized')
        }

        return this.eventsQueue.sendToQueue(
            'events',
            Buffer.from(
                JSON.stringify({
                    ...event,
                    id: this.id,
                })
            )
        )
    }
}
