import { Inject, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { useEnv } from '@configs/env'

import { USER_REPOSITORY } from '../../auth.tokens'
import { UserRepositoryPort } from '../../database/repositories/user.repository.port'

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepositoryPort
    ) {
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
        const id = payload.sub
        if (!id || !id.toString().match(/^[0-9a-fA-F]{24}$/)) {
            return null
        }

        const result = await this.userRepository.findOneById(id)
        if (result.isSome()) {
            return result.unwrap()
        }
        return null
    }
}
