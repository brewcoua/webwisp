import { Logger } from 'winston'

export default abstract class Service {
    protected name: string
    protected logger: Logger

    protected constructor(name: string, logger: Logger) {
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
