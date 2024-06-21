import { atom } from 'nanostores'

import TaskResult from '@domain/TaskResult'

export const $results = atom<TaskResult[]>([])

export function addResult(result: TaskResult) {
    $results.set([...$results.get(), result])
}
