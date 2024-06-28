import { atom, onMount } from 'nanostores'
import { navigate } from 'wouter/use-browser-location'

import { useClient } from '@api/client'
import { TaskEvent, TaskEventType } from '@domain/task.events'
import { CycleReport, TaskProps, TaskStatus } from '@domain/task.types'

export const $tasks = atom<TaskProps[]>([])

export function addTask(task: TaskProps) {
    // Add, check for duplicates, and sort
    $tasks.set(
        [...$tasks.get(), task]
            .filter(
                (task, index, self) =>
                    self.findIndex((t) => t.id === task.id) === index
            )
            .sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
            )
    )
}

export function addTasks(tasks: TaskProps[]) {
    $tasks.set([...$tasks.get(), ...tasks])
    // Remove duplicates
    $tasks.set(
        $tasks
            .get()
            .filter(
                (task, index, self) =>
                    self.findIndex((t) => t.id === task.id) === index
            )
    )
    // Sort by date
    $tasks.set(
        $tasks
            .get()
            .sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
            )
    )
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
    Promise.all([
        useClient().tasks.getTasks(),
        useClient().tasks.getQueuedTasks(),
    ]).then(([tasks, queuedTasks]) => {
        if (tasks === null || queuedTasks === null) {
            navigate('/login')
            return
        }

        addTasks(tasks)
        addTasks(queuedTasks)
    })

    const sub = useClient().tasks.subscribe()
    const source = sub.subscribe()

    source.onmessage = (event) => {
        const taskEvent: TaskEvent = JSON.parse(event.data)
        switch (taskEvent.type) {
            case TaskEventType.QUEUED:
                addTask({
                    ...taskEvent.task,
                    id: taskEvent.id,
                })
                break
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
