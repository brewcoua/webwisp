import TaskEntity from '../../domain/task.entity'

export interface TaskQueuesRepositoryPort {
    connect(): Promise<void>
    findTaskById(id: string): TaskEntity | null
    sendTask(task: TaskEntity): boolean
    bulkSendTasks(tasks: TaskEntity[]): boolean
}
