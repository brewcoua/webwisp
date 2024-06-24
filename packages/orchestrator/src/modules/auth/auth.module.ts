import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'

import AuthService from './auth.service'
import AuthController from './auth.controller'
import { LocalStrategy } from './guards/local'
import { JwtStrategy } from './guards/jwt'
import { useEnv } from '@configs/env'

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: useEnv('JWT_SECRET'),
            signOptions: { expiresIn: useEnv('JWT_EXPIRES_IN') },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy],
})
export default class AuthModule {}
