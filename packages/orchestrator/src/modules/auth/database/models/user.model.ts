import { ObjectLiteral } from '@domain/types'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

import { UserScopes } from '../../domain/user.types'

@Schema({
    timestamps: true,
    versionKey: false,
})
export class User {
    @Prop({
        required: true,
        unique: true,
        maxlength: 32,
        minlength: 3,
        match: /^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$/,
    })
    username: string

    @Prop({
        required: true,
        maxlength: 32,
        minlength: 3,
    })
    displayName: string

    @Prop({
        required: true,
        match: /^\$argon2id\$v=[0-9]+\$m=[0-9]+,t=[0-9]+,p=[0-9]+\$[a-zA-Z0-9\/\+\$]+$/,
    })
    password: string

    @Prop({
        type: [String],
        default: [],
        enum: UserScopes,
    })
    scopes: string[]

    constructor(user: IUser) {
        this.username = user.username
        this.displayName = user.displayName
        this.password = user.password
        this.scopes = user.scopes
    }
}

export type UserDocument = HydratedDocument<User>

export const UserSchema = SchemaFactory.createForClass(User)

export interface IUser extends ObjectLiteral {
    _id: Types.ObjectId
    createdAt: Date
    updatedAt: Date

    username: string
    displayName: string
    password: string
    scopes: string[]
}
