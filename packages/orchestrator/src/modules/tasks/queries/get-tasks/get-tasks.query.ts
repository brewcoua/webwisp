import { PaginatedParams, PaginatedQueryBase } from '@domain/ddd'

export class GetTasksQuery extends PaginatedQueryBase {
    readonly status?: string
    readonly target?: string
    readonly prompt?: string
    readonly group?: string

    constructor(props: PaginatedParams<GetTasksQuery>) {
        super(props)
        this.status = props.status
        this.target = props.target
        this.prompt = props.prompt
        this.group = props.group
    }
}
