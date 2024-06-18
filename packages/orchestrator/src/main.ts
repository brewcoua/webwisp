import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule } from '@nestjs/swagger'
import { WinstonModule } from 'nest-winston'

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
    app.useGlobalPipes(new ValidationPipe())
    app.getHttpAdapter().getInstance().disable('x-powered-by')

    const document = SwaggerModule.createDocument(app, makeSwaggerConfig())
    SwaggerModule.setup('docs', app, document)

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
