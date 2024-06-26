import { RequireAtLeastOne } from '@domain/types'

export const ValidationOptions = {
    id: {
        length: 24,
        match: /^[a-fA-F0-9]{24}$/,
    },
    displayName: {
        minLength: 3,
        maxLength: 32,
    },
    username: {
        minLength: 3,
        maxLength: 32,
        match: /^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$/,
    },
    password: {
        minLength: 8,
        maxLength: 64,
    },
} satisfies IValidationOptions

export const LimitOptions = {
    pagination: {
        limit: {
            min: 1,
            max: 100,
            default: 20,
        },
        page: {
            min: 1,
            max: 99999,
            default: 1,
        },
    },
} satisfies ILimitOptions

export enum MessageQueues {
    Tasks = 'tasks',
    WorkerEvents = 'worker_events',
    TaskEvents = 'task_events',
}

// Type definitions

const ValidationKeys = ['displayName', 'username', 'email', 'password']
type ValidationKey = (typeof ValidationKeys)[number]

type ValidationOption = RequireAtLeastOne<{
    length?: number
    minLength?: number
    maxLength?: number
    match?: RegExp
}>
type IValidationOptions = Record<ValidationKey, ValidationOption>

const LimitKeys = ['limit', 'page']
type LimitKey = (typeof LimitKeys)[number]

type LimitOption = RequireAtLeastOne<{
    min?: number
    max?: number
    default?: number
}>
type NestedLimitOptions = Record<LimitKey, LimitOption>

type ILimitOptions = {
    pagination: NestedLimitOptions
}
