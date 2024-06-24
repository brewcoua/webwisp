import { Entity } from '@domain/ddd'
import { CreateUserProps, UserProps, UserScopes } from './user.types'
import { AggregateID } from '@domain/ddd/entity.base'
import { Encrypt } from '@domain/utils/encrypt'

export default class UserEntity extends Entity<UserProps> {
    protected readonly _id!: AggregateID

    static create(create: CreateUserProps) {
        const id = AggregateID.create()
        const props: UserProps = {
            ...create,
            displayName: create.username,
            scopes: [UserScopes.VIEW],
        }

        const user = new UserEntity({
            id,
            props,
        })

        return user
    }

    comparePassword(password: string): Promise<boolean> {
        return Encrypt.compare(password, this.props.password)
    }

    validate() {
        // Check that scopes are valid
        if (this.props.scopes) {
            this.props.scopes.forEach((scope) => {
                if (!Object.values(UserScopes).includes(scope)) {
                    throw new Error(`Invalid scope: ${scope}`)
                }
            })
        }
    }
}
