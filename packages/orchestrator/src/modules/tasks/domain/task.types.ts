import { Action } from './action.types'

export interface TaskProps {
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
    COMPLETED = 'completed',
    FAILED = 'failed',
}

export interface CycleReport {
    action: Action
    reasoning?: string
    duration: number
}
