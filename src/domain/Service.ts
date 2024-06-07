export default abstract class Service {
    protected name: string

    protected constructor(name: string) {
        this.name = name
    }

    public initialize(): Promise<void> {
        return Promise.resolve()
    }

    public destroy(): Promise<void> {
        return Promise.resolve()
    }
}
