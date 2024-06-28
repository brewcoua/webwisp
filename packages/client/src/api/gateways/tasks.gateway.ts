import { BASE_URL, fetchAuthed } from '@api/client'

import { SseClient } from '@domain/api/sse.client'
import { CreateTaskProps, TaskProps } from '@domain/task.types'

import { useAccessToken } from './auth.gateway'
import { TaskEvent } from '@domain/task.events'

export default class TasksGateway {
    async createTask(task: CreateTaskProps): Promise<{ id: string }> {
        const response = await fetchAuthed(`${BASE_URL}/api/tasks/create`, {
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

    async bulkTasks(tasks: CreateTaskProps[]): Promise<string[]> {
        const response = await fetchAuthed(`${BASE_URL}/api/tasks/bulk`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tasks),
        })

        if (!response?.ok) {
            throw new Error('Failed to create tasks')
        }

        return response.json()
    }

    async getTask(id: string): Promise<TaskProps | null> {
        const response = await fetchAuthed(`${BASE_URL}/api/tasks/find/${id}`)

        if (!response?.ok) {
            return null
        }

        return response.json()
    }

    async getTasks(): Promise<TaskProps[] | null> {
        const response = await fetchAuthed(`${BASE_URL}/api/tasks?limit=100`)

        if (!response?.ok) {
            return null
        }

        const tasks = await response.json()

        return tasks.data
    }

    async getCorrelation(): Promise<string | null> {
        const response = await fetchAuthed(`${BASE_URL}/api/tasks/correlation`)
        if (!response?.ok) {
            return null
        }

        return response.text()
    }

    async getQueuedTasks(): Promise<TaskProps[] | null> {
        const response = await fetchAuthed(`${BASE_URL}/api/tasks/queued`)

        if (!response?.ok) {
            return null
        }

        return response.json()
    }

    async deleteTask(id: string): Promise<void> {
        const response = await fetchAuthed(`${BASE_URL}/api/tasks/${id}`, {
            method: 'DELETE',
        })

        if (!response?.ok) {
            throw new Error('Failed to delete task')
        }
    }

    async getTrace(id: string): Promise<string | null> {
        const response = await fetchAuthed(`${BASE_URL}/api/tasks/trace/${id}`)

        if (!response?.ok) {
            return null
        }

        const result = await response.json()

        return `${BASE_URL}/api/tasks/viewer/-/?trace=${
            BASE_URL || location.origin
        }${result.url}`
    }

    subscribe(): SseClient<TaskEvent> {
        return new SseClient(
            `${BASE_URL}/api/tasks/subscribe`,
            useAccessToken() ?? undefined
        )
    }
}
