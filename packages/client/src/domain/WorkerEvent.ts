import ActionReport from './ActionReport'
import { Task } from './Task'
import TaskResult from './TaskResult'
import Worker from './Worker'

export enum WorkerEventType {
    STARTED = 'started',
    TASK_STARTED = 'task-started',
    CYCLE_COMPLETED = 'cycle-completed',
    TASK_COMPLETED = 'task-completed',
    DISCONNECT = 'disconnect',
}

export type WorkerEvent = (
    | StartedWorkerEvent
    | TaskStartedWorkerEvent
    | CycleCompletedWorkerEvent
    | TaskCompletedWorkerEvent
    | DisconnectWorkerEvent
) & { id: string }

export type StartedWorkerEvent = {
    type: WorkerEventType.STARTED
    worker: Worker
}
export type TaskStartedWorkerEvent = {
    type: WorkerEventType.TASK_STARTED
    task: Task
}
export type CycleCompletedWorkerEvent = {
    type: WorkerEventType.CYCLE_COMPLETED
    report: ActionReport
}
export type TaskCompletedWorkerEvent = {
    type: WorkerEventType.TASK_COMPLETED
    result: TaskResult
}
export type DisconnectWorkerEvent = {
    type: WorkerEventType.DISCONNECT
}
