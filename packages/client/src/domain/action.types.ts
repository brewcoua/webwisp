export type Action = {
    type: ActionType
    arguments: ActionArguments
    status: ActionStatus
}

export type ActionArguments = Record<string, ActionArgumentPrimitive>
export type ActionArgumentPrimitive = string | number | boolean

export enum ActionStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed',
}

export enum ActionType {
    CLICK = 'click',
    TYPE = 'type',
    HOVER = 'hover',
    SELECT = 'select',
    PRESS_ENTER = 'press_enter',
    SCROLL = 'scroll',

    BACK = 'back',
    FORWARD = 'forward',
    DONE = 'done',
}
