import { fetchAuthed } from '@api/client'
import IWorkersGateway from '@domain/gateways/workers.gateway'
import Worker from '@domain/Worker'
import { useAccessToken } from './auth.gateway'

export default class WorkersGateway implements IWorkersGateway {
    async getWorkers(): Promise<Worker[]> {
        const response = await fetchAuthed('/api/workers')
        if (!response?.ok) {
            throw new Error('Failed to fetch workers')
        }

        return response.json()
    }

    subscribe(): EventSource {
        return new EventSource(
            '/api/workers/events?access_token=' +
                encodeURIComponent(useAccessToken() || '')
        )
    }
}
