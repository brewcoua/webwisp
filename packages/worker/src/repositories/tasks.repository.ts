import RabbitMQService from '@services/rabbitmq'
import amqp from 'amqplib'

export default class TasksRepository {
    private channel: amqp.Channel | null = null

    constructor(private readonly rabbitMQService: RabbitMQService) {}

    async initialize() {
        this.channel = await this.rabbitMQService.createChannel()
        await this.channel.assertQueue('tasks_queue', { durable: true })
        await this.channel.prefetch(1)
    }

    bind(callback: (msg: amqp.ConsumeMessage) => void) {
        if (!this.channel) {
            throw new Error('Channel is not initialized')
        }

        this.channel.consume('tasks_queue', (msg) => msg && callback(msg), {
            noAck: false,
        })
    }

    ack(msg: amqp.ConsumeMessage) {
        if (!this.channel) {
            throw new Error('Channel is not initialized')
        }

        this.channel.ack(msg)
    }

    nack(msg: amqp.ConsumeMessage) {
        if (!this.channel) {
            throw new Error('Channel is not initialized')
        }

        this.channel.nack(msg, false, true)
    }
}
