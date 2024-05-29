export abstract class Service {
    protected name: string

    protected constructor(name: string) {
        this.name = name
    }

    abstract initialize(): Promise<void>

    abstract destroy(): Promise<void>
}
