import { Controller, Get, Sse } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { Observable, fromEvent, map } from 'rxjs'

import WorkersService from './workers.service'
import { WorkerEntity } from './domain/Worker'
import { WorkerEvent } from './domain/WorkerEvent'

@Controller('workers')
export default class WorkersController {
    constructor(
        private readonly eventEmitter: EventEmitter2,
        private readonly workersService: WorkersService
    ) {}

    @Get()
    @ApiOperation({
        summary: 'Get all workers',
        description: 'Returns a list of all workers',
    })
    @ApiResponse({
        status: 200,
        description: 'List of workers',
        type: WorkerEntity,
        isArray: true,
    })
    getAll() {
        return this.workersService.getWorkers()
    }

    @Sse('events')
    @ApiOperation({
        summary: 'Subscribe to worker events',
        description: 'Subscribe to worker events',
    })
    @ApiResponse({
        status: 200,
        description: 'Worker events',
    })
    subscribe(): Observable<MessageEvent> {
        return fromEvent(this.eventEmitter, 'worker').pipe(
            map((event) => {
                const { type, ...data } = event as WorkerEvent
                return new MessageEvent(type, { data })
            })
        )
    }
}
