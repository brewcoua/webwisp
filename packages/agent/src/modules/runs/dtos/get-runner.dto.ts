import { ActionReport, Runner, RunnerStatus } from '@webwisp/types'

export default class GetRunnerDTO implements Runner {
    id: number
    name: string
    status: RunnerStatus
    createdAt: Date
    config: {
        target: string
        prompt: string
    }
    actions: ActionReport[]

    constructor(runner: Runner) {
        this.id = runner.id
        this.name = runner.name
        this.status = runner.status
        this.createdAt = runner.createdAt
        this.config = runner.config
        this.actions = runner.actions
    }
}
