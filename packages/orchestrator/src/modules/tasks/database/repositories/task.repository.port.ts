import {
    MatchQueryParams,
    Paginated,
    PaginatedQueryParams,
    RepositoryPort,
} from '@domain/ddd'
import TaskEntity from '../../domain/task.entity'

export interface TaskRepositoryPort extends RepositoryPort<TaskEntity> {
    findAllPaginatedByGroup(
        params: PaginatedQueryParams,
        group?: string,
        matches?: MatchQueryParams[]
    ): Promise<Paginated<TaskEntity>>
}
