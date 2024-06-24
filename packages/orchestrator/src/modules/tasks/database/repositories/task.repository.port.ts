import { RepositoryPort } from '@domain/ddd'
import TaskEntity from '../../domain/task.entity'

export interface TaskRepositoryPort extends RepositoryPort<TaskEntity> {}
