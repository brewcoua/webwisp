import { signal } from '@preact/signals'

import * as Gateways from './gateways'
import * as MockGateways from './mock'

const isDevelopment = import.meta.env.DEV

export class Client {
    public readonly tasks = isDevelopment
        ? new MockGateways.TasksGateway()
        : new Gateways.TasksGateway()
    public readonly workers = isDevelopment
        ? new MockGateways.WorkersGateway()
        : new Gateways.WorkersGateway()
}

export const client = signal<Client>(new Client())
export const useClient = () => client.value
