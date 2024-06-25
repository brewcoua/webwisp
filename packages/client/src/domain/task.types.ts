import { Action } from './action.types'

export interface TaskProps {
    id: string
    createdAt: string
    updatedAt: string

    target: string
    prompt: string
    status: TaskStatus

    message?: string
    value?: string

    cycles: CycleReport[]
}

export interface CreateTaskProps {
    target: string
    prompt: string
}

export enum TaskStatus {
    PENDING = 'pending',
    RUNNING = 'running',
    COMPLETED = 'completed',
    FAILED = 'failed',
}

export interface CycleReport {
    action: Action
    reasoning?: string
    duration: number
}
