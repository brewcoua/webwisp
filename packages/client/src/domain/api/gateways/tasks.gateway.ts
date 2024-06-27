import { CreateTaskProps, TaskProps } from '@domain/task.types'
import { SseClient } from '../sse.client'
import { TaskEvent } from '@domain/task.events'

export default interface ITasksGateway {
    createTask(task: CreateTaskProps): Promise<{ id: string }>
    getTask(id: string): Promise<TaskProps | null>
    getTasks(): Promise<TaskProps[] | null>
    getTrace(id: string): string
    deleteTask(id: string): Promise<void>
    subscribe(): SseClient<TaskEvent>
}
