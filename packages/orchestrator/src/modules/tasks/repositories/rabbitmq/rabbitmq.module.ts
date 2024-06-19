import {
    Logger,
    Module,
    OnApplicationBootstrap,
    OnApplicationShutdown,
} from '@nestjs/common'
import RabbitMQRepository from './rabbitmq.repository'

@Module({
    providers: [RabbitMQRepository],
    exports: [RabbitMQRepository],
})
export default class RabbitMQModule
    implements OnApplicationBootstrap, OnApplicationShutdown
{
    constructor(private readonly rabbitMQRepository: RabbitMQRepository) {}

    async onApplicationBootstrap() {
        await this.rabbitMQRepository.initialize()
        Logger.log('RabbitMQ connection initialized', 'RabbitMQModule')
    }

    async onApplicationShutdown() {
        await this.rabbitMQRepository.close()
        Logger.log('RabbitMQ connection closed', 'RabbitMQModule')
    }
}
