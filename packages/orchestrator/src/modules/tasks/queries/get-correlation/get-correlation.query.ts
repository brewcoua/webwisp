import { Params, QueryBase } from '@domain/ddd'

export class GetCorrelationQuery extends QueryBase {
    constructor(props: Params<GetCorrelationQuery>) {
        super()
    }
}
