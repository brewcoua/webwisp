import Worker from '@domain/Worker'

export default interface IWorkersGateway {
    getWorkers(): Promise<Worker[]>
    subscribe(): EventSource
}
