import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import {
    Inject,
    ConflictException as HttpConflictException,
} from '@nestjs/common'
import { Err, Ok, Result } from 'oxide.ts'

import { AggregateID } from '@domain/ddd/entity.base'
import { Encrypt } from '@domain/utils/encrypt'
import { ConflictException } from '@domain/db/mongo-repository.base'

import { USER_REPOSITORY } from '../../auth.tokens'
import { CreateUserCommand } from './create-user.command'
import { UserRepositoryPort } from '../../database/repositories/user.repository.port'
import UserEntity from '../../domain/user.entity'

@CommandHandler(CreateUserCommand)
export class CreateUserService implements ICommandHandler {
    constructor(
        @Inject(USER_REPOSITORY)
        protected readonly userRepository: UserRepositoryPort
    ) {}

    async execute(
        command: CreateUserCommand
    ): Promise<Result<AggregateID, Error>> {
        const hashedPassword = await Encrypt.hash(command.password)

        const user = UserEntity.create({
            username: command.username,
            password: hashedPassword,
        })

        try {
            await this.userRepository.transaction(async () =>
                this.userRepository.insert(user)
            )
            return Ok(user.id)
        } catch (error: any) {
            if (error instanceof ConflictException) {
                return Err(new HttpConflictException('User already exists'))
            }
            throw error
        }
    }
}
