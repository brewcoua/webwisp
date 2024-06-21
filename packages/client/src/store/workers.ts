import { atom, onMount } from 'nanostores'

import { WorkerEvent, WorkerEventType } from '@domain/WorkerEvent'
import Worker from '@domain/Worker'
import PopulatedTask from '@domain/PopulatedTask'
import ActionReport from '@domain/ActionReport'
import WorkerStatus from '@domain/WorkerStatus'

import { useClient } from '@api/client'
import { addResult } from './results'

export const $workers = atom<Worker[]>([])

export function addWorker(worker: Worker) {
    $workers.set([...$workers.get(), worker])
}

export function removeWorker(id: string) {
    $workers.set($workers.get().filter((worker) => worker.id !== id))
}

export function setWorkerStatus(id: string, status: WorkerStatus) {
    $workers.set(
        $workers.get().map((worker) => {
            if (worker.id === id) {
                return { ...worker, status }
            }

            return worker
        })
    )
}

export function setWorkerTask(id: string, task: PopulatedTask) {
    $workers.set(
        $workers.get().map((worker) => {
            if (worker.id === id) {
                return { ...worker, task }
            }

            return worker
        })
    )
}

export function clearWorkerTask(id: string) {
    $workers.set(
        $workers.get().map((worker) => {
            if (worker.id === id) {
                return { ...worker, task: undefined }
            }

            return worker
        })
    )
}

export function addWorkerTaskAction(id: string, action: ActionReport) {
    $workers.set(
        $workers.get().map((worker) => {
            if (worker.id === id) {
                return {
                    ...worker,
                    task: worker.task
                        ? {
                              ...worker.task,
                              actions: [...worker.task.actions, action],
                          }
                        : undefined,
                }
            }

            return worker
        })
    )
}

onMount($workers, () => {
    const client = useClient()

    const source = client.workers.subscribe()

    source.onmessage = (event) => {
        const data = JSON.parse(event.data) as WorkerEvent

        switch (data.type) {
            case WorkerEventType.STARTED:
                addWorker(data.worker)
                break
            case WorkerEventType.TASK_STARTED:
                setWorkerTask(data.id, {
                    ...data.task,
                    actions: [],
                })
                setWorkerStatus(data.id, WorkerStatus.BUSY)
                break
            case WorkerEventType.CYCLE_COMPLETED:
                addWorkerTaskAction(data.id, data.report)
                break
            case WorkerEventType.TASK_COMPLETED:
                addResult(data.result)
                clearWorkerTask(data.id)
                setWorkerStatus(data.id, WorkerStatus.READY)
                break
            case WorkerEventType.DISCONNECT:
                removeWorker(data.id)
                break
        }
    }

    client.workers.getWorkers().then((workers) => {
        workers.forEach((worker) => {
            addWorker(worker)
        })
    })

    return () => {
        source.close()
    }
})
