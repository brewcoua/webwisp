import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { WinstonModule } from 'nest-winston'
import winston from 'winston'

import RunsModule from './modules/runs/runs.module'
import AgentModule from './modules/agent/agent.module'
import PreviewModule from './modules/preview/preview.module'

@Module({
    imports: [
        WinstonModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                transports: [
                    new winston.transports.Console({
                        level: configService.get('LOG_LEVEL') || 'info',
                        format: winston.format.combine(
                            winston.format.timestamp(),
                            winston.format.colorize(),
                            winston.format.simple()
                        ),
                    }),
                    new winston.transports.File({
                        filename: 'logs/error.log',
                        level: 'error',
                        format: winston.format.combine(
                            winston.format.timestamp(),
                            winston.format.json()
                        ),
                    }),
                    new winston.transports.File({
                        filename: 'logs/debug.log',
                        level: 'debug',
                        format: winston.format.combine(
                            winston.format.timestamp(),
                            winston.format.json()
                        ),
                    }),
                ],
            }),
        }),
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
    providers: [],
})
export class AppModule {}
