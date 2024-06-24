import Worker from './Worker'
import WorkerStatus from './WorkerStatus'

export enum WorkerEventType {
    STARTED = 'started',
    STATUS_CHANGED = 'status-changed',
    DISCONNECT = 'disconnect',
}

export type WorkerEvent = (
    | StartedWorkerEvent
    | StatusChangedWorkerEvent
    | DisconnectWorkerEvent
) & { id: string }

export type StartedWorkerEvent = {
    type: WorkerEventType.STARTED
    worker?: Worker
}

export type DisconnectWorkerEvent = {
    type: WorkerEventType.DISCONNECT
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
    task_id: string
}
