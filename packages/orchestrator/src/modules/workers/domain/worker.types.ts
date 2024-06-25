export interface WorkerProps {
    tag: string

    status: WorkerStatus
    task?: string
}

export interface CreateWorkerProps {
    id: string
    tag: string
}

export enum WorkerStatus {
    READY = 'ready',
    BUSY = 'busy',
}
