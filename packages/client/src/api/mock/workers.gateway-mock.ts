import IWorkersGateway from '@domain/api/gateways/workers.gateway'
import { SseClient } from '@domain/api/sse.client'
import { WorkerProps, WorkerStatus } from '@domain/worker.types'

export default class WorkersGatewayMock implements IWorkersGateway {
    async getWorkers(): Promise<WorkerProps[]> {
        return [
            {
                id: 'mock-worker-id-1',
                tag: 'mock-worker-tag',
                createdAt: new Date(),
                updatedAt: new Date(),
                status: WorkerStatus.BUSY,
                task: 'dsqdsq3dqsd',
            },
            {
                id: 'mock-worker-id-2',
                tag: 'mock-worker-tag',
                createdAt: new Date(),
                updatedAt: new Date(),
                status: WorkerStatus.READY,
            },
            {
                id: 'mock-worker-id-4',
                tag: 'mock-worker-tag',
                createdAt: new Date(),
                updatedAt: new Date(),
                status: WorkerStatus.BUSY,
                task: 'dsqdsq3dqssd',
            },
        ]
    }

    subscribe(): SseClient<any> {
        return new SseClient('')
    }
}
