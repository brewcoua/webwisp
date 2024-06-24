import { fetchAuthed } from '@api/client'
import ITasksGateway from '@domain/gateways/tasks.gateway'
import { PartialTask } from '@domain/Task'
import TaskResult from '@domain/TaskResult'

export default class TasksGateway implements ITasksGateway {
    async createTask(task: PartialTask): Promise<{ id: string }> {
        const response = await fetchAuthed('/api/tasks', {
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

    async getResults(): Promise<TaskResult[]> {
        const response = await fetchAuthed('/api/tasks/results')

        if (!response?.ok) {
            throw new Error('Failed to fetch results')
        }

        return response.json()
    }
}
