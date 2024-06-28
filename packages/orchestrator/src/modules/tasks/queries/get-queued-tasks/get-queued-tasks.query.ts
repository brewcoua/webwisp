import { Params, QueryBase } from '@domain/ddd'

export class GetQueuedTasksQuery extends QueryBase {
    readonly status?: string
    readonly target?: string
    readonly prompt?: string

    constructor(props: Params<GetQueuedTasksQuery>) {
        super()
        this.status = props.status
        this.target = props.target
        this.prompt = props.prompt
    }
}
