import { Logger, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { EventEmitterModule } from '@nestjs/event-emitter'

import RunsModule from './modules/runs/runs.module'
import AgentModule from './modules/agent/agent.module'
import PreviewModule from './modules/preview/preview.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
        }),
        EventEmitterModule.forRoot(),

        AgentModule,
        RunsModule,
        PreviewModule,
    ],
    controllers: [],
    providers: [Logger],
})
export class AppModule {}
