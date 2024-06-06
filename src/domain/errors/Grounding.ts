import WebwispError from './Error'

export class GroundingError extends WebwispError {
    constructor(message: string) {
        super(message)
        this.name = 'GroundingError'
    }
}

export class GroundingScreenshotError extends GroundingError {
    constructor() {
        super(`Failed to take a screenshot`)
        this.name = 'GroundingScreenshotError'
    }
}
