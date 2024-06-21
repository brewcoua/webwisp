import { signal } from '@preact/signals'
import { TasksGateway, WorkersGateway } from './gateways'

export class Client {
    public readonly tasks = new TasksGateway()
    public readonly workers = new WorkersGateway()
}

export const client = signal<Client>(new Client())
export const useClient = () => client.value
