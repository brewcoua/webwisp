import { Params, QueryBase } from '@domain/ddd'

export class LoginUserQuery extends QueryBase {
    readonly username: string
    readonly password: string

    constructor(props: Params<LoginUserQuery>) {
        super()
        this.username = props.username
        this.password = props.password
    }
}
