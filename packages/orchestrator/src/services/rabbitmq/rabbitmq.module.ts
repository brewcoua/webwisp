import {
    Global,
    Module,
    OnApplicationBootstrap,
    OnApplicationShutdown,
} from '@nestjs/common'

import RabbitMQService from './rabbitmq.service'

@Global()
@Module({
    providers: [RabbitMQService],
    exports: [RabbitMQService],
})
export default class RabbitMQModule
    implements OnApplicationBootstrap, OnApplicationShutdown
{
    constructor(private readonly rabbitMQService: RabbitMQService) {}

    async onApplicationBootstrap() {
        await this.rabbitMQService.initialize()
    }

    async onApplicationShutdown() {
        await this.rabbitMQService.close()
    }
}
