import type { ActionArgumentPrimitive } from './ActionArgument'
import ActionType from './ActionType'
import CalledActionStatus from './CalledActionStatus'

type CalledAction = {
    type: ActionType
    description: string
    arguments: Record<string, string | number | boolean>
    status?: CalledActionStatus
}

export type CalledActionArguments = Record<string, ActionArgumentPrimitive>

export default CalledAction
