import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Inject, UnauthorizedException } from '@nestjs/common'
import { Err, Ok, Result } from 'oxide.ts'

import { LoginUserQuery } from './login.query'
import { USER_REPOSITORY } from '../../auth.tokens'
import { UserRepositoryPort } from '../../database/repositories/user.repository.port'
import UserEntity from '../../domain/user.entity'

@QueryHandler(LoginUserQuery)
export class LoginQueryHandler implements IQueryHandler<LoginUserQuery> {
    constructor(
        @Inject(USER_REPOSITORY) private readonly repository: UserRepositoryPort
    ) {}

    async execute(query: LoginUserQuery): Promise<Result<UserEntity, Error>> {
        const user = await this.repository.findOneByUsername(query.username)

        if (!user || !user.comparePassword(query.password)) {
            return Err(new UnauthorizedException('Invalid credentials'))
        }

        return Ok(user)
    }
}
