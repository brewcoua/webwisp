import {
    Controller,
    Get,
    HttpStatus,
    Param,
    Res,
    StreamableFile,
} from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger'

import { Public } from '@modules/auth'
import { Result, match } from 'oxide.ts'
import { GetTraceQuery } from './get-trace.query'
import { Response } from 'express'
import { ReadStream } from 'fs'

@ApiTags('tasks')
@Controller('tasks')
export class GetTraceHttpController {
    constructor(private readonly queryBus: QueryBus) {}

    @ApiOperation({ summary: 'Get playwright trace for task' })
    @ApiResponse({
        status: HttpStatus.PERMANENT_REDIRECT,
        description: 'Redirect to the trace file',
    })
    @ApiBearerAuth()
    @Public()
    @Get('trace/:id')
    async getTrace(
        @Param('id') id: string,
        @Res() res: Response
    ): Promise<void> {
        const result: Result<string, Error> = await this.queryBus.execute(
            new GetTraceQuery({ id })
        )

        return match(result, {
            Ok: (url) => {
                res.redirect(url)
            },
            Err: (error) => {
                throw error
            },
        })
    }
}
