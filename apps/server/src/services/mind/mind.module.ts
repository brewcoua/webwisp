import { Module } from '@nestjs/common'

import MindService from './mind.service'

@Module({
    providers: [MindService],
    exports: [MindService],
})
export default class MindModule {}
