import IWorkersGateway from '@domain/gateways/workers.gateway'

import Worker from '@domain/Worker'
import WorkerStatus from '@domain/WorkerStatus'

export default class WorkersGatewayMock implements IWorkersGateway {
    async getWorkers(): Promise<Worker[]> {
        return [
            {
                id: 'mock-worker-id-1',
                tag: 'mock-worker-tag',
                createdAt: new Date(),
                updatedAt: new Date(),
                status: WorkerStatus.BUSY,
                task: {
                    id: 'dsqdsq3dqsd',
                    createdAt: new Date(),
                    target: 'https://example.com',
                    prompt: 'Check that the page loads.',
                    actions: [],
                },
            },
            {
                id: 'mock-worker-id-2',
                tag: 'mock-worker-tag',
                createdAt: new Date(),
                updatedAt: new Date(),
                status: WorkerStatus.READY,
            },
            {
                id: 'mock-worker-id-3',
                tag: 'mock-worker-tag',
                createdAt: new Date(),
                updatedAt: new Date(),
                status: WorkerStatus.OFFLINE,
            },
        ]
    }

    subscribe(): EventSource {
        return new EventSource('/api/workers/events')
    }
}
