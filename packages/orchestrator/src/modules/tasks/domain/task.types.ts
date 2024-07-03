import { Action } from './action.types'
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

    login_script?: LoginScripts
    group?: string
    difficulty?: TaskDifficultyProps
    evaluation?: {
        results: TaskEvaluationResult[]
        config: TaskEvaluationProps
    }
}

export interface CreateTaskProps {
    target: string
    prompt: string

    login_script?: LoginScripts
    group?: string
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
    description: string
    actions: Action[]
    reasoning?: string
    duration: number
}

export enum LoginScripts {
    CLASSIFIEDS = 'classifieds',
}
