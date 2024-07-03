import { RepositoryPort } from '@domain/ddd'
import TaskGroupEntity from '../../domain/group.entity'

export interface TaskGroupRepositoryPort
    extends RepositoryPort<TaskGroupEntity> {}
