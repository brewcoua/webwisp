import { Body, Controller, Get, Param, Post, Sse } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { RunEvent, RunnerStatus } from '@webwisp/types'
import { Observable, fromEvent, map } from 'rxjs'

import RunsService from './runs.service'
import GetRunnerParams from './dtos/get-runner.params'
import CreateRunnerDto from './dtos/create-runner.dto'
import RunnerEntity from './entities/runner.entity'

@Controller('runs')
export default class RunsController {
    constructor(
        private eventEmitter: EventEmitter2,
        private runsService: RunsService
    ) {}

    @Get()
    @ApiResponse({ status: 200, description: 'Returns all runs' })
    getAll(): RunnerEntity[] {
        return []
    }

    @Get(':id')
    @ApiResponse({ status: 200, description: 'Returns a run by ID', type: RunnerEntity })
    @ApiResponse({ status: 404, description: 'Run not found' })
    getRun(@Param() params: GetRunnerParams): RunnerEntity {
        return {
            id: params.id,
            name: 'Run',
            status: RunnerStatus.STARTING,
            createdAt: new Date(),
            config: {
                target: 'https://example.com',
                prompt: 'Run prompt',
            },
            actions: [],
        }
    }

    @Sse(':id/events')
    @ApiResponse({ status: 200, description: 'Returns events for a run' })
    @ApiResponse({ status: 404, description: 'Run not found' })
    getRunEvents(@Param() params: GetRunnerParams): Observable<MessageEvent> {
        return fromEvent(this.eventEmitter, `run.${params.id}`).pipe(
            map((data) => {
                const event = data as RunEvent
                return new MessageEvent(event.type, { data: event.data })
            })
        )
    }

    @Post()
    @ApiOperation({ summary: 'Create a new run', description: 'Creates a new run with the specified target and prompt' })
    @ApiResponse({ status: 201, description: 'Run created', type: RunnerEntity })
    async createRun(@Body() createRunnerDto: CreateRunnerDto): Promise<RunnerEntity> {
        return this.runsService.createRun(createRunnerDto.target, createRunnerDto.prompt)
    }
}
