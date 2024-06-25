import { CreateWorkerProps, WorkerStatus } from './worker.types'

export enum WorkerEventType {
    STARTED = 'started',
    STATUS_CHANGED = 'status-changed',
    DISCONNECTED = 'disconnected',
}

export type WorkerEvent = (
    | StartedWorkerEvent
    | StatusChangedWorkerEvent
    | DisconnectedWorkerEvent
) & { id: string }

export type StartedWorkerEvent = {
    type: WorkerEventType.STARTED
    worker: CreateWorkerProps
}

export type DisconnectedWorkerEvent = {
    type: WorkerEventType.DISCONNECTED
}

export type StatusChangedWorkerEvent =
    | StatusChangedReadyWorkerEvent
    | StatusChangedBusyWorkerEvent

export type StatusChangedReadyWorkerEvent = {
    type: WorkerEventType.STATUS_CHANGED
    status: WorkerStatus.READY
}
export type StatusChangedBusyWorkerEvent = {
    type: WorkerEventType.STATUS_CHANGED
    status: WorkerStatus.BUSY
    task: string
}
