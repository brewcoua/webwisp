import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export default class RunsService {
    constructor(private eventEmitter: EventEmitter2) {}
}
