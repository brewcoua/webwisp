import { Action } from '@domain/action.types'
import {
    TaskDifficultyProps,
    TaskEvaluationProps,
    TaskEvaluationResult,
} from './task.eval'

export interface TaskProps {
    target: string
    prompt: string
    status: TaskStatus

    message?: string
    value?: string

    cycles: CycleReport[]

    correlation?: string
    difficulty?: TaskDifficultyProps
    evaluation?: {
        results: TaskEvaluationResult[]
        config: TaskEvaluationProps
    }
}

export interface CreateTaskProps {
    id: string
    target: string
    prompt: string

    login_script?: LoginScripts
    correlation?: string
    difficulty?: TaskDifficultyProps
    evaluation?: TaskEvaluationProps
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

export enum LoginScripts {
    CLASSIFIEDS = 'classifieds',
}
