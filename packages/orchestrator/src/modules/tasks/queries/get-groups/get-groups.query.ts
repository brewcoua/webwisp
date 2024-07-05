import { PaginatedParams, PaginatedQueryBase } from '@domain/ddd'

export class GetGroupsQuery extends PaginatedQueryBase {
    constructor(props: PaginatedParams<GetGroupsQuery>) {
        super(props)
    }
}
