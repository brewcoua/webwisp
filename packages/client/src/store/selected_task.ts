import { atom } from 'nanostores'

export const $selected_task = atom<string | null>(null)

export const setSelectedTask = (task_id: string) => {
    $selected_task.set(task_id)
}
