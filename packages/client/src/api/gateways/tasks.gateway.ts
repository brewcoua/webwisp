import { fetchAuthed } from '@api/client'

import ITasksGateway from '@domain/api/gateways/tasks.gateway'
import { SseClient } from '@domain/api/sse.client'
import { CreateTaskProps, TaskProps } from '@domain/task.types'

import { useAccessToken } from './auth.gateway'
import { TaskEvent } from '@domain/task.events'

export default class TasksGateway implements ITasksGateway {
    async createTask(task: CreateTaskProps): Promise<{ id: string }> {
        const response = await fetchAuthed('/api/tasks/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        })

        if (!response?.ok) {
            throw new Error('Failed to create task')
        }

        return response.json()
    }

    async getTask(id: string): Promise<TaskProps> {
        const response = await fetchAuthed(`/api/tasks/find/${id}`)

        if (!response?.ok) {
            throw new Error('Failed to fetch results')
        }

        return response.json()
    }

    async getTrace(id: string): Promise<Blob | null> {
        const response = await fetchAuthed(`/api/tasks/trace/${id}`)

        if (!response?.ok) {
            return null
        }

        return response.blob()
    }

    subscribe(): SseClient<TaskEvent> {
        return new SseClient(
            '/api/tasks/subscribe',
            useAccessToken() ?? undefined
        )
    }
}
