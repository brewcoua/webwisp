import { Runner } from "../types"

export const RunEvents = {
    RUNNER_CREATED: 'runner.created',
    RUNNER_DESTROYED: 'runner.destroyed',
}

export default RunEvents

export type RunEvent = RunnerCreatedEvent | RunnerDestroyedEvent

export type RunnerCreatedEvent = {
    type: typeof RunEvents.RUNNER_CREATED
    data: {
        runner: Runner
    }
}
export type RunnerDestroyedEvent = {
    type: typeof RunEvents.RUNNER_DESTROYED,
    data: {
        id: number,
    }
}