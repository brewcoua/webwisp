import { useConfig } from '@configs/env'

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
            secretOrKey: useConfig().jwt.secret,
        })
    }

    async validate(payload: any) {
        return { id: payload.sub, username: payload.username }
    }
}
