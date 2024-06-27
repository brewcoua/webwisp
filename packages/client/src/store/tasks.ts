import { atom, onMount } from 'nanostores'
import { navigate } from 'wouter/use-browser-location'

import { useClient } from '@api/client'
import { TaskEvent, TaskEventType } from '@domain/task.events'
import { CycleReport, TaskProps, TaskStatus } from '@domain/task.types'

export const $tasks = atom<TaskProps[]>([])

export function addTask(task: TaskProps) {
    // Check if it doesn't exist already
    if ($tasks.get().find((t) => t.id === task.id)) {
        // If it does, replace it
        $tasks.set($tasks.get().map((t) => (t.id === task.id ? task : t)))
        return
    }

    $tasks.set([...$tasks.get(), task])
}

export function removeTask(id: string) {
    $tasks.set($tasks.get().filter((task) => task.id !== id))
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

export function addTaskCycle(id: string, cycle: CycleReport) {
    $tasks.set(
        $tasks.get().map((task) => {
            if (task.id === id) {
                return { ...task, cycles: [...task.cycles, cycle] }
            }

            return task
        })
    )
}

export function clearTaskCycles(id: string) {
    $tasks.set(
        $tasks.get().map((task) => {
            if (task.id === id) {
                return { ...task, cycles: [] }
            }

            return task
        })
    )
}

export function setTaskStatus(id: string, status: TaskStatus) {
    $tasks.set(
        $tasks.get().map((task) => {
            if (task.id === id) {
                return { ...task, status }
            }

            return task
        })
    )
}

onMount($tasks, () => {
    useClient()
        .tasks.getTasks()
        .then((tasks) => {
            if (tasks) {
                $tasks.set(tasks)
            } else {
                navigate('/login')
            }
        })

    const sub = useClient().tasks.subscribe()
    const source = sub.subscribe()

    source.onmessage = (event) => {
        const taskEvent: TaskEvent = JSON.parse(event.data)
        switch (taskEvent.type) {
            case TaskEventType.STARTED:
                addTask({
                    ...taskEvent.task,
                    id: taskEvent.id,
                })
                break
            case TaskEventType.CYCLE_COMPLETED:
                addTaskCycle(taskEvent.id, taskEvent.report)
                break
            case TaskEventType.COMPLETED:
                addTask(taskEvent.task)
                break
            case TaskEventType.REQUEUED:
                clearTaskCycles(taskEvent.id)
                setTaskStatus(taskEvent.id, TaskStatus.PENDING)
                break
        }
    }

    return () => {
        source.close()
    }
})
