import { Controller, Get, Query, Sse } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger'
import { Observable, fromEvent, map } from 'rxjs'

import WorkersService from './workers.service'
import { WorkerEntity } from './domain/Worker'

@ApiTags('workers')
@ApiBearerAuth()
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
    subscribe(
        @Query('access_token') accessToken: string
    ): Observable<MessageEvent> {
        return fromEvent(this.eventEmitter, 'worker').pipe(
            map((event) => {
                return new MessageEvent('message', { data: event })
            })
        )
    }
}
