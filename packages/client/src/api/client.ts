import { signal } from '@preact/signals'
import { navigate } from 'wouter/use-browser-location'

import { TasksGateway, WorkersGateway, AuthGateway } from './gateways'
import { TasksGatewayMock, WorkersGatewayMock, AuthGatewayMock } from './mock'
import { useAccessToken } from './gateways/auth.gateway'

import ITasksGateway from '@domain/gateways/tasks.gateway'
import IWorkersGateway from '@domain/gateways/workers.gateway'
import IAuthGateway from '@domain/gateways/auth.gateway'

export class Client {
    public readonly auth: IAuthGateway
    public readonly tasks: ITasksGateway
    public readonly workers: IWorkersGateway

    constructor() {
        const isDevelopment = import.meta.env.DEV === true

        if (isDevelopment) {
            this.auth = new AuthGatewayMock()
            this.tasks = new TasksGatewayMock()
            this.workers = new WorkersGatewayMock()
        } else {
            this.auth = new AuthGateway()
            this.tasks = new TasksGateway()
            this.workers = new WorkersGateway()
        }
    }
}

export const client = signal<Client>(new Client())
export const useClient = () => client.value

export const fetchAuthed = async (input: RequestInfo, init?: RequestInit) => {
    const token = useAccessToken()
    if (!token) {
        return navigate('/login')
    }

    const headers: any = init?.headers || {}
    headers['Authorization'] = `Bearer ${token}`

    const response = await fetch(input, { ...init, headers })

    // Check if response is unauthorized
    if (response.status === 401) {
        return navigate('/login')
    }

    return response
}
