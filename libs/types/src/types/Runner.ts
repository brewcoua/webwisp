import ActionReport from '../types/ActionReport'
import RunnerStatus from '../types/RunnerStatus'

export default interface Runner {
    id: number
    name: string
    status: RunnerStatus

    createdAt: Date

    config: {
        target: string
        prompt: string
    }

    actions: ActionReport[]
}
