import { APP_GUARD } from '@nestjs/core'
import { Logger, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { join } from 'path'

import TasksModule from '@modules/tasks'
import HealthModule from '@modules/health'
import { WorkersModule } from '@modules/workers'
import AuthModule from '@modules/auth'
import { JwtAuthGuard } from '@modules/auth/guards/jwt'

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
        AuthModule,
    ],
    controllers: [],
    providers: [
        Logger,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
