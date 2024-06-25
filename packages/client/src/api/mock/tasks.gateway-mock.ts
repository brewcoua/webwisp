import { ActionStatus, ActionType } from '@domain/action.types'
import ITasksGateway from '@domain/api/gateways/tasks.gateway'
import { SseClient } from '@domain/api/sse.client'

import { CreateTaskProps, TaskProps, TaskStatus } from '@domain/task.types'

export default class TasksGatewayMock implements ITasksGateway {
    async createTask(task: CreateTaskProps): Promise<{ id: string }> {
        return {
            id: 'mock-task-id',
        }
    }

    async getTask(id: string): Promise<TaskProps> {
        return {
            id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),

            target: 'https://example.com',
            prompt: 'Check that the page loads.',
            message: 'Task completed successfully.',
            value: 'done',
            status: TaskStatus.RUNNING,

            cycles: [
                {
                    action: {
                        type: ActionType.TYPE,
                        description: 'Type in the input',
                        arguments: {
                            label: 3,
                            text: 'Hello, world!',
                        },
                        status: ActionStatus.COMPLETED,
                    },
                    reasoning: 'The input seems to be working.',
                    duration: 1740,
                },
                {
                    action: {
                        type: ActionType.CLICK,
                        description: 'Click on the button.',
                        arguments: {
                            label: 3,
                        },
                        status: ActionStatus.FAILED,
                    },
                    reasoning: 'The page did not load.',
                    duration: 1000,
                },
            ],
        }
    }

    async getTrace(id: string): Promise<Blob | null> {
        return null
    }

    subscribe(): SseClient<any> {
        return new SseClient('')
    }
}
