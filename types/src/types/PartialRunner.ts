import RunnerStatus from './RunnerStatus'

export default interface PartialRunner {
    id: string
    status: RunnerStatus
    pageId: string
    createdAt: Date
    config: {
        target: string
        prompt: string
    }
}
