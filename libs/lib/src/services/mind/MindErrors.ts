import WebwispError from '../../domain/WebwispError'

export class GenerationError extends WebwispError {
    constructor(message: string) {
        super(message)
        this.name = 'GenerationError'
    }
}
