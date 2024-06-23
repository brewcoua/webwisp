import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import argon2 from 'argon2'

import User from './domain/User'
import PublicUser from './domain/PublicUser'

@Injectable()
export default class AuthService {
    private readonly users: User[] = []
    constructor(private readonly jwtService: JwtService) {}

    async getUser(username: string): Promise<User | undefined> {
        return this.users.find((user) => user.username === username)
    }

    async validateUser(
        username: string,
        password: string
    ): Promise<PublicUser | null> {
        const user = await this.getUser(username)

        if (user && (await argon2.verify(user.password, password))) {
            const { password, ...result } = user
            return result
        }

        return null
    }

    async login(user: PublicUser): Promise<string> {
        const payload = { username: user.username, sub: user.id }

        return this.jwtService.sign(payload)
    }
}
