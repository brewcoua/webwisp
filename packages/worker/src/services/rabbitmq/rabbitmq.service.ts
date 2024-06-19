import amqp from 'amqplib'

export default class RabbitMQService {
    private connection: amqp.Connection | null = null

    async initialize() {
        this.connection = await amqp.connect(
            `amqp://${process.env.RABBITMQ_HOST || 'localhost'}`
        )
    }

    async createChannel() {
        if (!this.connection) {
            throw new Error('Connection is not initialized')
        }

        return this.connection.createChannel()
    }
}
