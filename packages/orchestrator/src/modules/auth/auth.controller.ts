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
import argon2 from 'argon2'
import { Request } from 'express'

import PublicUser from './domain/PublicUser'
import { LocalAuthGuard } from './guards/local'
import AuthService from './auth.service'
import { Public } from './guards/public.guard'

import AuthDto from './dtos/auth.dto'
import LoginDto from './dtos/login.dto'
import UserDto from './dtos/user.dto'

@ApiTags('auth')
@Controller('auth')
export default class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({ summary: 'Login' })
    @ApiResponse({
        status: 200,
        description: 'Login successful',
        type: AuthDto,
    })
    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(
        @Body() loginDto: LoginDto,
        @Req() req: Request
    ): Promise<AuthDto> {
        const jwt = await this.authService.login(req.user as PublicUser)
        return new AuthDto(jwt)
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current user' })
    @ApiResponse({
        status: 200,
        description: 'Current user',
        type: UserDto,
    })
    @Get('me')
    async me(@Req() req: Request): Promise<UserDto> {
        return req.user as PublicUser
    }

    @Public()
    @Get('hash/:password')
    async getHashedPassword(
        @Param('password') password: string
    ): Promise<string> {
        return argon2.hash(password)
    }
}
