import { Logger, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CqrsModule } from '@nestjs/cqrs'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'

import TasksModule from './modules/tasks'
import HealthModule from './modules/health'

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
        }),
        CqrsModule.forRoot(),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'public'),
            exclude: ['/api*'],
        }),

        HealthModule,
        TasksModule,
    ],
    controllers: [],
    providers: [Logger],
})
export class AppModule {}
