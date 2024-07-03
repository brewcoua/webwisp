import {
    Action,
    ActionArgumentPrimitive,
    ActionArguments,
} from '@domain/action.types'

export type ParsedResult = {
    success: true
    actions: Action[]
    description: string
    reasoning?: string
}
export default ParsedResult

export type ParseError = {
    success: false
    error: string
}

export type ParsedActions = {
    success: true
    description: string
    actions: Action[]
}

export type ParsedAction = {
    success: true
    action: Action
}

export type ParsedArguments = {
    success: true
    arguments: ActionArguments
}

export type ParsedArgument = {
    success: true
    argument: ActionArgumentPrimitive
}
