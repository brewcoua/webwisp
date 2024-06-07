import type { AbstractArgumentPrimitive } from './AbstractArgument'
import ActionStatus from './ActionStatus'
import ActionType from './ActionType'

type Action = {
    type: ActionType
    description: string
    arguments: Record<string, string | number | boolean>
    status: ActionStatus
}

export type ActionArguments = Record<string, AbstractArgumentPrimitive>

export default Action
