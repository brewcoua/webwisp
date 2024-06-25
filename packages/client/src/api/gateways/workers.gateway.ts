import { fetchAuthed } from '@api/client'
import IWorkersGateway from '@domain/api/gateways/workers.gateway'
import { useAccessToken } from './auth.gateway'
import { WorkerProps } from '@domain/worker.types'
import { SseClient } from '@domain/api/sse.client'
import { WorkerEvent } from '@domain/worker.events'

export default class WorkersGateway implements IWorkersGateway {
    async getWorkers(): Promise<WorkerProps[]> {
        const response = await fetchAuthed('/api/workers')
        if (!response?.ok) {
            throw new Error('Failed to fetch workers')
        }

        return response.json()
    }

    subscribe(): SseClient<WorkerEvent> {
        return new SseClient(
            '/api/workers/subscribe',
            useAccessToken() ?? undefined
        )
    }
}
