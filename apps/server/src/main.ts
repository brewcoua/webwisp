import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'
import makeSwaggerConfig from './configs/swagger'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.useGlobalPipes(new ValidationPipe())

    const document = SwaggerModule.createDocument(app, makeSwaggerConfig())
    SwaggerModule.setup('docs', app, document)

    await app.listen(3000)
}
void bootstrap()
