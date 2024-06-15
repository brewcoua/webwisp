export default class WebwispError extends Error {
    private context: Error | null = null

    constructor(message: string) {
        super(message)
        this.name = 'WebwispError'
    }

    public withContext(context: Error): WebwispError {
        this.context = context
        return this
    }
    public getContext(): Error | null {
        return this.context
    }
}
