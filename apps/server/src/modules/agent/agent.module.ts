import { Global, Module } from '@nestjs/common'
import AgentService from './agent.service'
import { BrowserModule } from '../../services/browser'
import { MindModule } from '../../services/mind'

@Global()
@Module({
    imports: [BrowserModule, MindModule],
    providers: [AgentService],
    exports: [AgentService],
})
export default class AgentModule {}
