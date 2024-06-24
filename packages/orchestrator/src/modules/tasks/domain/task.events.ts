import TaskEntity from './task.entity'
import { CycleReport } from './task.types'

export enum TaskEventType {
    STARTED = 'started',
    CYCLE_COMPLETED = 'cycle-completed',
    COMPLETED = 'completed',
}

export type TaskEvent = (
    | StartedTaskEvent
    | CycleCompletedTaskEvent
    | CompletedTaskEvent
) & { id: string }

export type StartedTaskEvent = {
    type: TaskEventType.STARTED
    task: TaskEntity
}
export type CycleCompletedTaskEvent = {
    type: TaskEventType.CYCLE_COMPLETED
    report: CycleReport
}
export type CompletedTaskEvent = {
    type: TaskEventType.COMPLETED
    task: TaskEntity
}
