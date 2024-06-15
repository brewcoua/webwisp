import ActionStatus from './ActionStatus'
import ActionType from './ActionType'

export type Action = {
    type: ActionType
    description: string
    arguments: ActionArguments
    status: ActionStatus
}

export type ActionArguments = Record<string, ActionArgumentPrimitive>
export type ActionArgumentPrimitive = string | number | boolean

export default Action
