import WorkerEntity from '@modules/workers/domain/worker.entity'

export interface WorkerQueuesRepositoryPort {
    connect(): Promise<void>

    getWorkers(): WorkerEntity[]
    findWorkerByTag(tag: string): WorkerEntity | null
    findWorkerById(id: string): WorkerEntity | null
    findWorkerByTask(task: string): WorkerEntity | null
}
