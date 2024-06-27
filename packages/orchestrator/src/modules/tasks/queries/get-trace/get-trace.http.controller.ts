import { Controller, Get, HttpStatus, Param } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger'
import { Result, match } from 'oxide.ts'

import { Scopes } from '@modules/auth'
import { UserScopes } from '@modules/auth/domain/user.types'

import { GetTraceQuery } from './get-trace.query'
import { GetTraceResponseDto } from './get-trace.response.dto'

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
    @Scopes(UserScopes.VIEW)
    @Get('trace/:id')
    async getTrace(@Param('id') id: string): Promise<GetTraceResponseDto> {
        const result: Result<string, Error> = await this.queryBus.execute(
            new GetTraceQuery({ id })
        )

        return match(result, {
            Ok: (url) => new GetTraceResponseDto(url),
            Err: (error) => {
                throw error
            },
        })
    }
}
