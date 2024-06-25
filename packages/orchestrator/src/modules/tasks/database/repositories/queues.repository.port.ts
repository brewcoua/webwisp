import TaskEntity from '../../domain/task.entity'

export interface TaskQueuesRepositoryPort {
    connect(): Promise<void>
    findTaskById(id: string): TaskEntity | null
    sendTaskToQueue(task: TaskEntity): boolean
}
