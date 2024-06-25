export interface WorkerProps {
    id: string
    createdAt: Date
    updatedAt: Date

    tag: string
    status: WorkerStatus
    task?: string
}

export enum WorkerStatus {
    READY = 'ready',
    BUSY = 'busy',
}
