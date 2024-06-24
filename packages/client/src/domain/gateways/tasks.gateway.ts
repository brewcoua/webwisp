import { PartialTask } from '@domain/Task'
import TaskResult from '@domain/TaskResult'

export default interface ITasksGateway {
    createTask(task: PartialTask): Promise<{ id: string }>
    getResults(): Promise<TaskResult[]>
}
