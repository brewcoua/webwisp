import { Controller, Get, Query, Sse, UseGuards } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger'
import { Observable, fromEvent, map } from 'rxjs'

import { ScopedJwtAuthGuard } from '@modules/auth'
import { UserScopes } from '@modules/auth/domain/user.types'

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
    @UseGuards(ScopedJwtAuthGuard(UserScopes.VIEW))
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
    @UseGuards(ScopedJwtAuthGuard(UserScopes.VIEW))
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
