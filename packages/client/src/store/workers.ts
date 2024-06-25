import { atom, onMount } from 'nanostores'

import { WorkerProps, WorkerStatus } from '@domain/worker.types'
import { useClient } from '@api/client'
import { WorkerEvent, WorkerEventType } from '@domain/worker.events'

export const $workers = atom<WorkerProps[]>([])

export function addWorker(worker: WorkerProps) {
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

export function setWorkerTask(id: string, task: string) {
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

onMount($workers, () => {
    const sub = useClient().workers.subscribe()
    const source = sub.subscribe()

    source.onmessage = (event) => {
        const workerEvent: WorkerEvent = JSON.parse(event.data)
        switch (workerEvent.type) {
            case WorkerEventType.STARTED:
                console.log('Adding worker', workerEvent.worker)
                addWorker(workerEvent.worker)
                break
            case WorkerEventType.DISCONNECTED:
                console.log('Removing worker', workerEvent.id)
                removeWorker(workerEvent.id)
                break
            case WorkerEventType.STATUS_CHANGED:
                console.log(
                    workerEvent.id,
                    'Setting worker status to',
                    workerEvent.status
                )
                setWorkerStatus(workerEvent.id, workerEvent.status)
                switch (workerEvent.status) {
                    case WorkerStatus.READY:
                        clearWorkerTask(workerEvent.id)
                        break
                    case WorkerStatus.BUSY:
                        setWorkerTask(workerEvent.id, workerEvent.task)
                        break
                }
                break
        }
    }

    return () => {
        source.close()
    }
})
