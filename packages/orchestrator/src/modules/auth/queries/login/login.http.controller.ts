import {
    Body,
    Controller,
    Post,
    UseGuards,
    Req,
    HttpStatus,
    HttpCode,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'

import { LocalAuthGuard } from './login.guard'
import { LoginRequestDto } from './login.request.dto'
import UserEntity from '../../domain/user.entity'
import AuthService from '../../auth.service'
import { LoginResponseDto } from './login.response.dto'
import { Public } from '../../guards/meta'

@ApiTags('auth')
@Controller('auth')
export class LoginHttpController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({ summary: 'Login with username & password' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'User logged in successfully',
        type: LoginResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Invalid credentials',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
    })
    @Public()
    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(
        @Body() props: LoginRequestDto,
        @Req() request: Request
    ): Promise<LoginResponseDto> {
        const jwt = await this.authService.login(request.user as UserEntity)
        return new LoginResponseDto({ access_token: jwt })
    }
}
