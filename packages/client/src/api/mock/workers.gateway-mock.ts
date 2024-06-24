import ActionStatus from '@domain/ActionStatus'
import ActionType from '@domain/ActionType'
import IWorkersGateway from '@domain/gateways/workers.gateway'

import Worker from '@domain/Worker'
import WorkerStatus from '@domain/WorkerStatus'

export default class WorkersGatewayMock implements IWorkersGateway {
    async getWorkers(): Promise<Worker[]> {
        return repeat(
            [
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
                        actions: [
                            {
                                action: {
                                    type: ActionType.Type,
                                    description: 'Type in the input',
                                    arguments: {
                                        label: 3,
                                        text: 'Hello, world!',
                                    },
                                    status: ActionStatus.Success,
                                },
                                reasoning: 'The input seems to be working.',
                                duration: 1740,
                            },
                            {
                                action: {
                                    type: ActionType.Click,
                                    description: 'Click on the button.',
                                    arguments: {
                                        label: 3,
                                    },
                                    status: ActionStatus.Failed,
                                },
                                reasoning: 'The page did not load.',
                                duration: 1000,
                            },
                        ],
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
                {
                    id: 'mock-worker-id-4',
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
            ],
            5
        )
    }

    subscribe(): EventSource {
        return new EventSource('/api/workers/events')
    }
}

function repeat(arr: any[], times: number) {
    return [].concat(...Array(times).fill(arr))
}
