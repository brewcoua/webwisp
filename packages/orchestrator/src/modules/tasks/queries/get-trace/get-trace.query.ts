import { Params, QueryBase } from '@domain/ddd'

export class GetTraceQuery extends QueryBase {
    readonly id: string

    constructor(props: Params<GetTraceQuery>) {
        super()
        this.id = props.id
    }
}
