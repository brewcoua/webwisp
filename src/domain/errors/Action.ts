import CalledAction from '../CalledAction'
import WebwispError from './Error'

export class ActionError extends WebwispError {
    constructor(message: string) {
        super(message)
        this.name = 'ActionError'
    }
}

export class ActionNotFoundError extends ActionError {
    constructor(label: number) {
        super(`Element #${label} not found`)
        this.name = 'ActionNotFoundError'
    }
}

export class ActionFailedError extends ActionError {
    constructor(action: CalledAction) {
        super(
            `Failed to perform ${action.type} on #${action.arguments.label} (${action.description})`
        )
        this.name = 'ActionFailedError'
    }
}

export class UnknownActionError extends ActionError {
    constructor(type: string) {
        super(`Unknown action type '${type}' to be performed`)
        this.name = 'UnknownActionError'
    }
}
