import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { EventEmitterModule } from '@nestjs/event-emitter'

import RunsModule from './modules/runs/runs.module'
import AgentModule from './modules/agent/agent.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
        }),
        EventEmitterModule.forRoot(),

        AgentModule,
        RunsModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
