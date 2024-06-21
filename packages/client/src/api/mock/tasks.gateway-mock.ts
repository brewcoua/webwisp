import { PartialTask } from '@domain/Task'
import TaskResult from '@domain/TaskResult'

export default class TasksGatewayMock {
    async createTask(task: PartialTask): Promise<{ id: string }> {
        return {
            id: 'mock-task-id',
        }
    }

    async getResults(): Promise<TaskResult[]> {
        return []
    }
}
