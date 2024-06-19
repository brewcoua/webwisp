import { Logger, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CqrsModule } from '@nestjs/cqrs'

import TasksModule from './modules/tasks'
import HealthModule from './modules/health'

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
        }),
        CqrsModule.forRoot(),

        HealthModule,
        TasksModule,
    ],
    controllers: [],
    providers: [Logger],
})
export class AppModule {}
