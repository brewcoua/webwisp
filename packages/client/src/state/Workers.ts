import { signal } from '@preact/signals'
import Worker from '@domain/Worker'

export const Workers = signal<Worker[]>([])

export type WorkerState = {
    worker: Worker
    update: (worker: Worker) => void
    delete: () => void
}

export const useWorkers = (): Worker[] => Workers.value

export const useWorker = (id: string): WorkerState | undefined => {
    const workers = useWorkers()
    const worker = workers.find((worker) => worker.id === id)

    if (!worker) {
        return
    }

    return {
        worker,
        update: (worker) => {
            Workers.value = workers.map((w) =>
                w.id === worker.id ? worker : w
            )
        },
        delete: () => {
            Workers.value = workers.filter((w) => w.id !== worker.id)
        },
    }
}

export const addWorker = (worker: Worker): void => {
    Workers.value = [...Workers.value, worker]
}
