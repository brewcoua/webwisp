import { useEnv } from '@configs/env'
import UserEntity from '@modules/auth/domain/user.entity'
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: (req: Request) => {
                if (req.query?.access_token) {
                    return req.query.access_token
                }

                return ExtractJwt.fromAuthHeaderAsBearerToken()(req)
            },
            ignoreExpiration: false,
            secretOrKey: useEnv('JWT_SECRET'),
        })
    }

    async validate(payload: any) {
        return new UserEntity({
            id: payload.sub,
            props: {
                username: payload.username,
                password: '********',
                displayName: payload.displayName,
                scopes: payload.scopes,
            },
        })
    }
}
