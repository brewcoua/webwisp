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

import { Scopes } from '@modules/auth'
import { UserScopes } from '@modules/auth/domain/user.types'
import { Result, match } from 'oxide.ts'
import { GetTraceQuery } from './get-trace.query'
import { Response } from 'express'

@ApiTags('tasks')
@Controller('tasks')
export class GetTraceHttpController {
    constructor(private readonly queryBus: QueryBus) {}

    @ApiOperation({ summary: 'Get playwright trace for task' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Playwright trace',
        type: StreamableFile,
    })
    @ApiBearerAuth()
    @Scopes(UserScopes.VIEW)
    @Get('trace/:id')
    async getTrace(
        @Param('id') id: string,
        @Res() res: Response
    ): Promise<StreamableFile> {
        const result: Result<StreamableFile, Error> =
            await this.queryBus.execute(new GetTraceQuery({ id }))

        return match(result, {
            Ok: (file) => {
                res.set({
                    'Content-Type': 'application/zip',
                    'Content-Disposition': `attachment; filename=${id}.zip`,
                })

                return file
            },
            Err: (error) => {
                throw error
            },
        })
    }
}
