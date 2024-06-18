import { Logger, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CqrsModule } from '@nestjs/cqrs'

import TasksModule from './modules/tasks'

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
        }),
        CqrsModule.forRoot(),

        TasksModule,
    ],
    controllers: [],
    providers: [Logger],
})
export class AppModule {}
