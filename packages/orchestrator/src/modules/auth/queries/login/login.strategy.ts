import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { QueryBus } from '@nestjs/cqrs'
import { Strategy } from 'passport-local'
import { match, Result } from 'oxide.ts'

import UserEntity from '../../domain/user.entity'
import { LoginUserQuery } from './login.query'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(private readonly queryBus: QueryBus) {
        super({
            usernameField: 'username',
            passwordField: 'password',
        })
    }

    async validate(username: string, password: string): Promise<UserEntity> {
        const query = new LoginUserQuery({ username, password })

        const result: Result<UserEntity, Error> =
            await this.queryBus.execute(query)

        return match(result, {
            Ok: (user: UserEntity) => user,
            Err: (error: Error): any => {
                throw error
            },
        })
    }
}
