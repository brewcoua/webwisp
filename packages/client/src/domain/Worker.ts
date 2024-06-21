import PopulatedTask from './PopulatedTask'
import WorkerStatus from './WorkerStatus'

export interface Worker {
    id: string
    tag: string
    createdAt: Date
    updatedAt: Date
    status: WorkerStatus
    task?: PopulatedTask
}
export default Worker
