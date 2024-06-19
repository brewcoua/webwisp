import TaskResult from '@domain/TaskResult'
import RabbitMQService from '@services/rabbitmq'

import amqp from 'amqplib'

export default class ResultsRepository {
    private channel: amqp.Channel | null = null

    constructor(private readonly rabbitMQService: RabbitMQService) {}

    async initialize() {
        this.channel = await this.rabbitMQService.createChannel()
        await this.channel.assertQueue('results_queue', { durable: true })
        await this.channel.prefetch(1)
    }

    send(result: TaskResult) {
        if (!this.channel) {
            throw new Error('Channel is not initialized')
        }

        this.channel.sendToQueue(
            'results_queue',
            Buffer.from(JSON.stringify(result))
        )
    }
}
