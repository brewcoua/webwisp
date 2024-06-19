import { Injectable } from '@nestjs/common'
import * as amqp from 'amqplib'

@Injectable()
export default class RabbitMQRepository {
    private connection: amqp.Connection | null = null
    private channel: amqp.Channel | null = null

    constructor() {}

    async initialize() {
        this.connection = await amqp.connect(
            `amqp://${process.env.RABBITMQ_HOST || 'localhost'}`
        )
        this.channel = await this.connection.createChannel()
        await this.channel.assertQueue('tasks_queue', { durable: true })
    }

    publish(message: string): boolean {
        if (!this.channel) {
            throw new Error('Channel not initialized')
        }

        return this.channel.sendToQueue('tasks_queue', Buffer.from(message))
    }

    async close() {
        if (this.channel) {
            await this.channel.close()
        }

        if (this.connection) {
            await this.connection.close()
        }
    }
}
