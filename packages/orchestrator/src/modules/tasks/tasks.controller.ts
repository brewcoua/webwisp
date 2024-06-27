import {
    Controller,
    Get,
    HttpStatus,
    Inject,
    NotFoundException,
    Param,
    Res,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'

import { Public } from '@modules/auth'
import { TRACES_REPOSITORY } from './tasks.tokens'
import { TracesRepositoryPort } from './database/repositories/traces.repository.port'

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
    constructor(
        @Inject(TRACES_REPOSITORY)
        private readonly tracesRepository: TracesRepositoryPort
    ) {}

    @ApiOperation({
        description: 'Get a remote trace',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'The trace file',
    })
    @Public()
    @Get('traces/remote/:filename')
    async getRemoteTrace(
        @Param('filename') filename: string,
        @Res() res: Response
    ) {
        const stream = await this.tracesRepository.streamTrace(filename)

        if (!stream) {
            throw new NotFoundException('Trace not found')
        }

        stream.pipe(res)
    }
}
