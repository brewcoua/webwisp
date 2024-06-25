import { Params, QueryBase } from '@domain/ddd'

export class GetWorkersQuery extends QueryBase {
    constructor(props: Params<GetWorkersQuery>) {
        super()
    }
}
