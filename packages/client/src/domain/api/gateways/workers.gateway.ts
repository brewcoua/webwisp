import { WorkerProps } from '@domain/worker.types'
import { SseClient } from '../sse.client'
import { WorkerEvent } from '@domain/worker.events'

export default interface IWorkersGateway {
    getWorkers(): Promise<WorkerProps[]>
    subscribe(): SseClient<WorkerEvent>
}
