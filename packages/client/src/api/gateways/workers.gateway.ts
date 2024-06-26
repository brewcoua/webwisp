import { BASE_URL, fetchAuthed } from '@api/client'
import { useAccessToken } from './auth.gateway'
import { WorkerProps } from '@domain/worker.types'
import { SseClient } from '@domain/api/sse.client'
import { WorkerEvent } from '@domain/worker.events'

export default class WorkersGateway {
    async getWorkers(): Promise<WorkerProps[]> {
        const response = await fetchAuthed(`${BASE_URL}/api/workers`)
        if (!response?.ok) {
            throw new Error('Failed to fetch workers')
        }

        return response.json()
    }

    subscribe(): SseClient<WorkerEvent> {
        return new SseClient(
            `${BASE_URL}/api/workers/subscribe`,
            useAccessToken() ?? undefined
        )
    }
}
