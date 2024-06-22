import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'

import { useConfig } from '@configs/env'

import AuthService from './auth.service'
import AuthController from './auth.controller'
import { LocalStrategy } from './guards/local'
import { JwtStrategy } from './guards/jwt'

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: useConfig().jwt.secret,
            signOptions: { expiresIn: useConfig().jwt.expiresIn },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy],
})
export default class AuthModule {}
