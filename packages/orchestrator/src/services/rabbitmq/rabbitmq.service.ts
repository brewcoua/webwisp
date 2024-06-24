import { Injectable } from '@nestjs/common'
import amqp from 'amqplib'

import { useEnv } from '@configs/env'

@Injectable()
export default class RabbitMQService {
    private connection: amqp.Connection | null = null

    private readonly channels: amqp.Channel[] = []

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
    }

    async getQueue(name: string): Promise<amqp.Channel> {
        if (!this.connection) {
            throw new Error('Connection not initialized')
        }

        const channel = await this.connection.createChannel()
        await channel.assertQueue(name)

        this.channels.push(channel)

        return channel
    }

    async close() {
        for (const channel of this.channels) {
            await channel.close()
        }

        if (this.connection) {
            await this.connection.close()
        }
    }
}
