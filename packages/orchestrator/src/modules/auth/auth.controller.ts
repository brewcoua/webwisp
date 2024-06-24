import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common'
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger'
import { Request } from 'express'

import UserResponseDto from './dtos/user.response.dto'
import AuthMapper from './auth.mapper'
import UserEntity from './domain/user.entity'
import { JwtAuthGuard } from './guards/jwt'

@ApiTags('auth')
@Controller('auth')
export default class AuthController {
    constructor(private readonly mapper: AuthMapper) {}

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current user' })
    @ApiResponse({
        status: 200,
        description: 'Current user',
        type: UserResponseDto,
    })
    @UseGuards(JwtAuthGuard)
    @Get('me')
    async me(@Req() req: Request): Promise<UserResponseDto> {
        return this.mapper.toResponse(req.user as UserEntity)
    }
}
