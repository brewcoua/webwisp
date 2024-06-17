import { Logger, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { EventEmitterModule } from '@nestjs/event-emitter'

import RunsModule from './modules/runs/runs.module'
import PreviewModule from './modules/preview/preview.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
        }),
        EventEmitterModule.forRoot(),

        RunsModule,
        PreviewModule,
    ],
    controllers: [],
    providers: [Logger],
})
export class AppModule {}
