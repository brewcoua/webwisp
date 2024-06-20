import TaskResult from '@domain/TaskResult'
import amqp from 'amqplib'
import { Logger } from 'winston'

export default class RabbitMQService {
    private connection: amqp.Connection | null = null

    public tasksQueue: amqp.Channel | null = null
    public resultsQueue: amqp.Channel | null = null

    private readonly logger: Logger

    constructor(logger: Logger) {
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

        this.resultsQueue = await this.createChannel()
        await this.createQueue(this.resultsQueue, 'results')

        this.logger.info('RabbitMQService initialized')
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

    publishResult(result: TaskResult): boolean {
        if (!this.resultsQueue) {
            throw new Error('Results queue is not initialized')
        }

        return this.resultsQueue.sendToQueue(
            'results',
            Buffer.from(JSON.stringify(result))
        )
    }
}
