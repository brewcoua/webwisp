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

import { GetCorrelationQuery } from './get-correlation.query'

@ApiTags('tasks')
@Controller('tasks')
export class GetCorrelationHttpController {
    constructor(private readonly queryBus: QueryBus) {}

    @ApiOperation({ summary: 'Generate a correlation id' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'The correlation id has been successfully generated',
        type: String,
    })
    @ApiBearerAuth()
    @Scopes(UserScopes.EDIT)
    @Get('correlation')
    async getCorrelation(): Promise<string> {
        const result: Result<string, Error> = await this.queryBus.execute(
            new GetCorrelationQuery({})
        )

        return match(result, {
            Ok: (id) => id,
            Err: (error) => {
                throw error
            },
        })
    }
}
