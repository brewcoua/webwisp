import {
    Body,
    Controller,
    Get,
    HttpCode,
    NotFoundException,
    Param,
    Post,
} from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

import RunsService from './runs.service'
import GetRunnerParams from './dtos/get-runner.params'
import CreateRunnerDto from './dtos/create-runner.dto'
import RunnerEntity from './entities/runner.entity'

@Controller('runs')
export default class RunsController {
    constructor(private runsService: RunsService) {}

    @Get()
    @ApiResponse({ status: 200, description: 'Returns all runs' })
    getAll(): RunnerEntity[] {
        return this.runsService.getRuns()
    }

    @Get(':id')
    @ApiResponse({
        status: 200,
        description: 'Returns a run by ID',
        type: RunnerEntity,
    })
    @ApiResponse({ status: 404, description: 'Run not found' })
    getRun(@Param() params: GetRunnerParams): RunnerEntity {
        const run = this.runsService.getRun(params.id)
        if (!run) {
            throw new NotFoundException(`Run with ID ${params.id} not found`)
        }
        return run
    }

    @Post()
    @ApiOperation({
        summary: 'Create a new run',
        description: 'Creates a new run with the specified target and prompt',
    })
    @ApiResponse({
        status: 201,
        description: 'Run created',
        type: RunnerEntity,
    })
    @HttpCode(201)
    async createRun(
        @Body() createRunnerDto: CreateRunnerDto
    ): Promise<RunnerEntity> {
        return this.runsService.createRun(
            createRunnerDto.target,
            createRunnerDto.prompt
        )
    }
}
