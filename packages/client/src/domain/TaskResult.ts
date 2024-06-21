import ActionReport from './ActionReport'
import TaskStatus from './TaskStatus'

export default interface TaskResult {
    id: string
    status: TaskStatus
    message: string
    value?: string
    actions: ActionReport[]
}
