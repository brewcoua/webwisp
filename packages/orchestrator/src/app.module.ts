import { APP_GUARD } from '@nestjs/core'
import { Logger, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { MongooseModule } from '@nestjs/mongoose'
import { CqrsModule } from '@nestjs/cqrs'
import { join } from 'path'

import { useEnv } from '@configs/env'

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
        CqrsModule.forRoot(),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'public'),
            exclude: ['/api*'],
        }),
        MongooseModule.forRoot(
            `mongodb+srv://${useEnv('MONGODB_USERNAME')}:${encodeURIComponent(useEnv('MONGODB_PASSWORD'))}@${useEnv('MONGODB_CLUSTER')}/${useEnv('MONGODB_DATABASE')}`,
            {
                retryWrites: true,
                writeConcern: {
                    w: 'majority',
                    wtimeout: 10000,
                },
                appName: 'orchestrator',
            }
        ),

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
