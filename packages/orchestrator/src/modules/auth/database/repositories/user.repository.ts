import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { IUser, User } from '../models/user.model'
import { Model } from 'mongoose'
import { MongoRepositoryBase } from '@domain/db/mongo-repository.base'
import UserEntity from '@modules/auth/domain/user.entity'
import { UserRepositoryPort } from './user.repository.port'
import AuthMapper from '@modules/auth/auth.mapper'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export default class UserRepository
    extends MongoRepositoryBase<UserEntity, IUser>
    implements UserRepositoryPort
{
    constructor(
        @InjectModel(User.name) protected readonly model: Model<User>,
        mapper: AuthMapper,
        eventEmitter: EventEmitter2
    ) {
        super(mapper, eventEmitter)
    }

    async findOneByUsername(username: string): Promise<UserEntity | null> {
        const user = await this.model.findOne({
            username,
        })

        if (!user) {
            return null
        }

        return this.mapper.toDomain(user)
    }
}
