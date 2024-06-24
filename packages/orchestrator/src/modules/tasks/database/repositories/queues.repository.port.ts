import { TaskEvent } from '../../domain/task.events'
import TaskEntity from '../../domain/task.entity'

export interface TaskQueuesRepositoryPort {
    connect(): Promise<void>
    sendTaskToQueue(task: TaskEntity): boolean
    bindEvents(handler: (event: TaskEvent) => void): void
}
