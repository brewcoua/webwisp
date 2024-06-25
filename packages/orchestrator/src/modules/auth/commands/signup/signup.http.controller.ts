import { Body, Controller, Post, HttpStatus, HttpCode } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CommandBus } from '@nestjs/cqrs'
import { Result, match } from 'oxide.ts'

import { Public } from '../../guards/meta'
import { SignUpRequestDto } from './signup.request.dto'
import { SignUpCommand } from './signup.command'
import AuthMapper from '../../auth.mapper'
import { AggregateID } from '@domain/ddd/entity.base'
import { SignUpResponseDto } from './signup.response.dto'

@ApiTags('auth')
@Controller('auth')
export class SignUpHttpController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly mapper: AuthMapper
    ) {}

    @ApiOperation({ summary: 'Sign up with username & password' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'User signed up successfully',
        type: SignUpResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Bad request',
    })
    @Public()
    @HttpCode(HttpStatus.CREATED)
    @Post('signup')
    async signup(@Body() props: SignUpRequestDto): Promise<SignUpResponseDto> {
        const result: Result<AggregateID, Error> =
            await this.commandBus.execute(new SignUpCommand(props))
        return match(result, {
            Ok: (aggregateID: AggregateID) => {
                return new SignUpResponseDto({
                    id: aggregateID,
                })
            },
            Err: (error) => {
                throw error
            },
        })
    }
}
