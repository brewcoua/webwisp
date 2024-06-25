import { Controller, Get, HttpStatus, Req } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger'
import { Result, match } from 'oxide.ts'
import { Request } from 'express'

import { CurrentUserQuery } from './current-user.query'
import UserEntity from '../../domain/user.entity'
import AuthMapper from '../../auth.mapper'
import UserResponseDto from '../../dtos/user.response.dto'

@ApiTags('auth')
@Controller('auth')
export class CurrentUserHttpController {
    constructor(
        private readonly queryBus: QueryBus,
        private readonly mapper: AuthMapper
    ) {}

    @ApiOperation({ summary: 'Get current user' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Current user',
        type: UserResponseDto,
    })
    @ApiBearerAuth()
    @Get('me')
    async me(@Req() req: Request) {
        const result: Result<UserEntity, Error> = await this.queryBus.execute(
            new CurrentUserQuery({
                id: (req.user as UserEntity).id,
            })
        )

        return match(result, {
            Ok: (user) => this.mapper.toResponse(user),
            Err: (error) => {
                throw error
            },
        })
    }
}
