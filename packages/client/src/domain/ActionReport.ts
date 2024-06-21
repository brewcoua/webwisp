import Action from './Action'

/**
 * Represents a report of an action execution.
 * @public
 */
export type ActionReport = {
    action: Action
    reasoning?: string
    duration: number
}
export default ActionReport
