import { Option } from 'oxide.ts'

export class Paginated<T> {
    readonly count: number
    readonly limit: number
    readonly page: number
    readonly data: readonly T[]

    constructor(props: Paginated<T>) {
        this.count = props.count
        this.limit = props.limit
        this.page = props.page
        this.data = props.data
    }
}

export enum SortOrder {
    ASC = 'asc',
    DESC = 'desc',
}

export type PaginatedQueryParams = {
    limit: number
    page: number
    offset: number
    orderBy: string
    sort: SortOrder
    createdAfter?: Date
    createdBefore?: Date
}

export interface RepositoryPort<Entity> {
    insert(entity: Entity | Entity[]): Promise<void>
    findOneById(id: string): Promise<Option<Entity>>
    findAll(): Promise<Entity[]>
    findAllPaginated(params: PaginatedQueryParams): Promise<Paginated<Entity>>
    delete(entity: Entity): Promise<boolean>
    deleteById(id: string): Promise<boolean>

    transaction<T>(handler: () => Promise<T>): Promise<T>
}
