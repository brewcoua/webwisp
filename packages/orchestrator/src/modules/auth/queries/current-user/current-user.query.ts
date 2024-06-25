import { Params, QueryBase } from '@domain/ddd'

export class CurrentUserQuery extends QueryBase {
    readonly id: string

    constructor(props: Params<CurrentUserQuery>) {
        super()
        this.id = props.id
    }
}
