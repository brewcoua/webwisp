import ActionType from '../../services/runner/domain/ActionType'
import WebwispError from './Error'

export class CompletionParsingError extends WebwispError {
    constructor(message: string) {
        super(message)
        this.name = 'CompletionParsingError'
    }
}

export class CompletionActionNotFoundError extends CompletionParsingError {
    constructor() {
        super('Action not found in completion')
        this.name = 'CompletionActionNotFoundError'
    }
}

export class CompletionFormatError extends CompletionParsingError {
    constructor(message: string) {
        super(`Invalid completion format: ${message}`)
        this.name = 'CompletionFormatError'
    }
}

export class CompletionMissingArgumentError extends CompletionParsingError {
    constructor(action: ActionType, args: string[]) {
        super(
            `Missing required arguments for action '${action}': ${args.join(', ')}`
        )
        this.name = 'CompletionMissingArgumentError'
    }
}
