import { ActionReport, Runner, RunnerStatus } from '../types'

export const RunEvents = {
    RUNNER_CREATED: 'runner.created',
    RUNNER_DESTROYED: 'runner.destroyed',
    STATUS_CHANGED: 'runner.status_changed',
    CYCLE_COMPLETED: 'runner.cycle_completed',
}

export default RunEvents

export type RunEvent =
    | RunnerCreatedEvent
    | RunnerDestroyedEvent
    | StatusChangedEvent
    | CycleCompletedEvent

export type RunnerCreatedEvent = {
    type: typeof RunEvents.RUNNER_CREATED
    data: {
        runner: Runner
    }
}
export type RunnerDestroyedEvent = {
    type: typeof RunEvents.RUNNER_DESTROYED
    data: {}
}
export type StatusChangedEvent = {
    type: typeof RunEvents.STATUS_CHANGED
    data: {
        status: RunnerStatus
    }
}
export type CycleCompletedEvent = {
    type: typeof RunEvents.CYCLE_COMPLETED
    data: {
        cycle: number
        action: ActionReport
    }
}
