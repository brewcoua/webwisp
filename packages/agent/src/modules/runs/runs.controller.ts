import { Body, Controller, Get, Param, Post, Sse } from '@nestjs/common'
import { Runner, RunnerStatus } from '@webwisp/types'

import RunsService from './runs.service'

@Controller('runs')
export default class RunsController {
    constructor(private runsService: RunsService) {}

    @Get()
    getAll(): Runner[] {
        return []
    }

    @Get(':id')
    getRun(@Param('id') id: number): Runner {
        return {
            id,
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
    getRunEvents() {
        return 'Get run events'
    }

    @Post()
    createRun(@Body() body: any) {
        return `Create a run with body: ${JSON.stringify(body)}`
    }
}
