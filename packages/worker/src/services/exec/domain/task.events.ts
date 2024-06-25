import { CycleReport, TaskProps } from './task.types'

export enum TaskEventType {
    STARTED = 'started',
    CYCLE_COMPLETED = 'cycle-completed',
    COMPLETED = 'completed',
    REQUEUED = 'requeued',
}

export type TaskEvent = (
    | StartedTaskEvent
    | CycleCompletedTaskEvent
    | CompletedTaskEvent
    | RequeuedTaskEvent
) & { id: string }

export type StartedTaskEvent = {
    type: TaskEventType.STARTED
    task: TaskProps
}
export type CycleCompletedTaskEvent = {
    type: TaskEventType.CYCLE_COMPLETED
    report: CycleReport
}
export type CompletedTaskEvent = {
    type: TaskEventType.COMPLETED
    task: TaskProps
}
export type RequeuedTaskEvent = {
    type: TaskEventType.REQUEUED
}
