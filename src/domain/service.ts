import { Logger } from 'pino'

export abstract class Service {
    protected logger: Logger;
    protected name: string;

    protected constructor(logger: Logger, name: string) {
        this.logger = logger;
        this.name = name;
    }

    abstract initialize(): Promise<void>;
    abstract destroy(): Promise<void>;

    public error(body: any, msg?: string) {
        this.logger.error(body, msg);
    }
    public warn(body: any, msg?: string) {
        this.logger.warn(body, msg);
    }
    public info(body: any, msg?: string) {
        this.logger.info(body, msg);
    }
    public debug(body: any, msg?: string) {
        this.logger.debug(body, msg);
    }
}