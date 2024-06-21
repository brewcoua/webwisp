import Worker from '@domain/Worker'

export default class WorkersGateway {
    async getWorkers(): Promise<Worker[]> {
        const response = await fetch('/api/workers')
        if (!response.ok) {
            throw new Error('Failed to fetch workers')
        }

        return response.json()
    }

    subscribe(): EventSource {
        return new EventSource('/api/workers/events')
    }
}
