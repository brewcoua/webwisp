import { Injectable } from '@nestjs/common'

import { Mapper } from '@domain/ddd/mapper.interface'
import { MongoUtils } from '@domain/utils'

import UserEntity from './domain/user.entity'
import { IUser } from './database/models/user.model'
import UserResponseDto from './dtos/user.response.dto'
import { UserScopes } from './domain/user.types'

@Injectable()
export default class AuthMapper
    implements Mapper<UserEntity, IUser, UserResponseDto>
{
    toPersistence(entity: UserEntity): IUser {
        const copy = entity.getProps()

        return {
            _id: MongoUtils.toObjectId(copy.id),
            createdAt: copy.createdAt,
            updatedAt: copy.updatedAt,

            username: copy.username,
            displayName: copy.displayName,
            password: copy.password,
            scopes: copy.scopes,
        }
    }

    toDomain(record: IUser): UserEntity {
        return new UserEntity({
            id: MongoUtils.fromObjectId(record._id),
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
            props: {
                username: record.username,
                displayName: record.displayName,
                password: record.password,
                scopes: record.scopes as UserScopes[],
            },
        })
    }

    toResponse(entity: UserEntity): UserResponseDto {
        const props = entity.getProps()
        const response = new UserResponseDto({
            id: props.id,
            createdAt: props.createdAt,
            updatedAt: props.updatedAt,
            username: props.username,
            displayName: props.displayName,
            scopes: props.scopes,
        })

        return response
    }
}
