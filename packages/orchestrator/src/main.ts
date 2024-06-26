import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule } from '@nestjs/swagger'
import { WinstonModule } from 'nest-winston'
import { NextFunction, Request, Response } from 'express'
import { join } from 'path'

import { AppModule } from './app.module'
import makeSwaggerConfig from './configs/swagger'
import makeLogger from './configs/logger'

async function bootstrap() {
    const logger = makeLogger()

    const app = await NestFactory.create(AppModule, {
        logger: WinstonModule.createLogger({
            instance: logger,
        }),
    })

    app.setGlobalPrefix('api')
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
        })
    )
    app.getHttpAdapter().getInstance().disable('x-powered-by')

    const document = SwaggerModule.createDocument(app, makeSwaggerConfig())
    SwaggerModule.setup('/api/docs', app, document)

    app.use((req: Request, res: Response, next: NextFunction) => {
        if (
            !req.originalUrl.startsWith('/api') &&
            !req.originalUrl.startsWith('/assets')
        ) {
            res.sendFile(join(__dirname, '..', 'public', 'index.html'))
        } else {
            next()
        }
    })

    let port = parseInt(process.env.PORT || '')
    if (!port || isNaN(port) || port > 65535 || port < 1) {
        port = 3000
    }

    await app.listen(port)
    logger.info(`Server is running on http://localhost:${port}`, {
        context: 'Bootstrap',
    })
}
void bootstrap()
