import { Global, Logger, Module } from "@nestjs/common";
import AgentService from "./agent.service";

@Global()
@Module({
    providers: [AgentService],
    exports: [AgentService],
})
export default class AgentModule {
    constructor(
        private readonly agentService: AgentService
    ) {}

    async onApplicationBootstrap() {
        const start = Date.now()
        await this.agentService.initialize()
        Logger.log(`Agent initialized in ${Date.now() - start}ms`, 'AgentModule')
    }
}