import type { AbstractArgumentPrimitive } from '../../runner/domain/AbstractArgument'
import Action, { ActionArguments } from '../../runner/domain/Action'

export type ParsedResult = {
    success: true
    action: Action
    reasoning?: string
}
export default ParsedResult

export type ParseError = {
    success: false
    error: string
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
    argument: AbstractArgumentPrimitive
}
