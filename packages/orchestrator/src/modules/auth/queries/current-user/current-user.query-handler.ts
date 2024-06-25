import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Inject, UnauthorizedException } from '@nestjs/common'
import { Err, Ok, Result } from 'oxide.ts'

import { USER_REPOSITORY } from '../../auth.tokens'
import { UserRepositoryPort } from '../../database/repositories/user.repository.port'
import UserEntity from '../../domain/user.entity'
import { CurrentUserQuery } from './current-user.query'

@QueryHandler(CurrentUserQuery)
export class CurrentUserQueryHandler
    implements IQueryHandler<CurrentUserQuery>
{
    constructor(
        @Inject(USER_REPOSITORY) private readonly repository: UserRepositoryPort
    ) {}

    async execute(query: CurrentUserQuery): Promise<Result<UserEntity, Error>> {
        const user = await this.repository.findOneById(query.id)

        if (user.isNone()) {
            return Err(new UnauthorizedException('User not found'))
        }

        return Ok(user.unwrap())
    }
}
