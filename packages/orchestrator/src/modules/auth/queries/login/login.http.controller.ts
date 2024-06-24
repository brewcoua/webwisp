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

import UserResponseDto from '../../dtos/user.response.dto'
import { LocalAuthGuard } from './login.guard'
import { LoginRequestDto } from './login.request.dto'
import UserEntity from '../../domain/user.entity'
import AuthService from '../../auth.service'
import { LoginResponseDto } from './login.response.dto'
import { Public } from '../../guards/public.guard'

@ApiTags('auth')
@Controller('auth')
export class LoginHttpController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({ summary: 'Login with local strategy (email & password)' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'User logged in successfully',
        type: UserResponseDto,
        headers: {
            'Set-Cookie': {
                description:
                    'Cookie with session id (connect.sid) that expires in 7 days',
                schema: {
                    type: 'string',
                },
            },
        },
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
