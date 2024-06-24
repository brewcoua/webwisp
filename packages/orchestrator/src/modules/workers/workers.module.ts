import { Global, Logger, Module, OnApplicationBootstrap } from '@nestjs/common'
import WorkersService from './workers.service'
import WorkersController from './workers.controller'

@Global()
@Module({
    providers: [WorkersService],
    controllers: [WorkersController],
    exports: [WorkersService],
})
export default class WorkersModule implements OnApplicationBootstrap {
    constructor(private readonly workersService: WorkersService) {}

    async onApplicationBootstrap() {
        await this.workersService.initialize()
        Logger.log('WorkersService initialized', 'WorkersModule')
    }
}
