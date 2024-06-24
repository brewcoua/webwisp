import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import UserEntity from './domain/user.entity'

@Injectable()
export default class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    async login(user: UserEntity): Promise<string> {
        const props = user.getProps()
        const payload = {
            username: props.username,
            displayName: props.displayName,
            scopes: props.scopes,
            sub: user.id,
        }

        return this.jwtService.sign(payload)
    }
}
