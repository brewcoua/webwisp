import { useClient } from '@api/client'
import { TaskProps } from '@domain/task.types'
import { atom } from 'nanostores'

export const $tasks = atom<TaskProps[]>([])

export function addTask(task: TaskProps) {
    $tasks.set([...$tasks.get(), task])
}

export async function getTask(id: string): Promise<TaskProps | null> {
    const cached = $tasks.get().find((task) => task.id === id)
    if (cached) {
        return cached
    }

    const response = await useClient().tasks.getTask(id)

    if (response) {
        addTask(response)
    }
    return response
}
