import {
    Global,
    Logger,
    Module,
    OnApplicationBootstrap,
    OnApplicationShutdown,
} from '@nestjs/common'
import WorkersService from './workers.service'
import WorkersController from './workers.controller'

@Global()
@Module({
    providers: [WorkersService],
    controllers: [WorkersController],
    exports: [WorkersService],
})
export default class WorkersModule
    implements OnApplicationBootstrap, OnApplicationShutdown
{
    constructor(private readonly workersService: WorkersService) {}

    async onApplicationBootstrap() {
        await this.workersService.initialize()
        Logger.log('WorkersService initialized', 'WorkersModule')
    }

    async onApplicationShutdown() {
        await this.workersService.close()
        Logger.log('WorkersService closed', 'WorkersModule')
    }
}
