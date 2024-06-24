import { PaginatedQueryParams, SortOrder } from './repository.port'
import { LimitOptions } from '@configs/app.const'

export abstract class QueryBase {}

export abstract class PaginatedQueryBase extends QueryBase {
    limit: number
    page: number
    offset: number

    orderBy: string
    sort: SortOrder

    createdAfter?: Date
    createdBefore?: Date

    protected constructor(props: PaginatedParams<PaginatedQueryBase>) {
        super()
        this.limit = props.limit ?? LimitOptions.pagination.limit.default ?? 20
        this.offset = props.page ? (props.page - 1) * this.limit : 0
        this.page = props.page ?? LimitOptions.pagination.page.default ?? 1
        this.orderBy = props.orderBy ?? '_id'
        this.sort = props.sort ?? SortOrder.ASC
        this.createdAfter = props.createdAfter
        this.createdBefore = props.createdBefore
    }
}

export type PaginatedParams<T> = Omit<
    T,
    | 'limit'
    | 'page'
    | 'offset'
    | 'orderBy'
    | 'sort'
    | 'createdAfter'
    | 'createdBefore'
> &
    Partial<Omit<PaginatedQueryParams, 'offset'>>

export type Params<T> = Readonly<T>
