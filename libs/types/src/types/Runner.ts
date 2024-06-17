import ActionReport from '../types/ActionReport'
import RunnerStatus from '../types/RunnerStatus'
import TaskResult from './TaskResult'

export default interface Runner {
    id: string
    status: RunnerStatus
    pageId: string

    createdAt: Date

    config: {
        target: string
        prompt: string
    }

    actions: ActionReport[]
    result?: TaskResult
}
