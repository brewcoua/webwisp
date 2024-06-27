import {
    Controller,
    Get,
    HttpStatus,
    Inject,
    NotFoundException,
    Param,
    Res,
} from '@nestjs/common'
import { ApiExcludeController } from '@nestjs/swagger'
import { Response } from 'express'

import { Public } from '@modules/auth'
import { TRACES_REPOSITORY } from './tasks.tokens'
import { TracesRepositoryPort } from './database/repositories/traces.repository.port'

@ApiExcludeController()
@Controller('tasks')
export class TasksController {
    constructor(
        @Inject(TRACES_REPOSITORY)
        private readonly tracesRepository: TracesRepositoryPort
    ) {}

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
