import { Params, QueryBase } from '@domain/ddd'

export class GetTaskQuery extends QueryBase {
    readonly id: string

    constructor(props: Params<GetTaskQuery>) {
        super()
        this.id = props.id
    }
}
