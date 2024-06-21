import { Logger, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { join } from 'path'

import TasksModule from './modules/tasks'
import HealthModule from './modules/health'
import { WorkersModule } from '@modules/workers'

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
        }),
        EventEmitterModule.forRoot(),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'public'),
            exclude: ['/api*'],
        }),

        WorkersModule,
        HealthModule,
        TasksModule,
    ],
    controllers: [],
    providers: [Logger],
})
export class AppModule {}
