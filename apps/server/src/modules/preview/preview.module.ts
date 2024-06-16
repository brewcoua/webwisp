import { Module } from '@nestjs/common'
import PreviewController from './preview.controller'

@Module({
    controllers: [PreviewController],
})
export default class PreviewModule {}
