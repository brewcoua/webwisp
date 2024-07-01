export interface CreateWorkerProps {
    id: string
    tag: string
}

export enum WorkerStatus {
    READY = 'ready',
    BUSY = 'busy',
}
