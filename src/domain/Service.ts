import { Logger } from 'winston'
import { EventEmitter } from 'node:events'

export default abstract class Service extends EventEmitter {
    protected name: string
    protected logger: Logger

    protected constructor(name: string, logger: Logger) {
        super()
        this.name = name
        this.logger = logger.child({ service: name })
    }

    public initialize(): Promise<void> {
        return Promise.resolve()
    }

    public destroy(): Promise<void> {
        return Promise.resolve()
    }
}
