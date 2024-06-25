export class SseClient<T> extends EventTarget {
    private source: EventSource | null = null
    private readonly full_url: string

    constructor(
        private readonly url: string,
        private readonly access_token?: string
    ) {
        super()
        this.full_url = access_token
            ? `${url}?access_token=${encodeURIComponent(access_token)}`
            : url
    }

    subscribe() {
        this.source = new EventSource(this.full_url)
        return this.source
    }

    close() {
        this.source?.close()
    }
}
