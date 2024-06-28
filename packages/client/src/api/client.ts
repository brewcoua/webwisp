import { signal } from '@preact/signals'

import { TasksGateway, WorkersGateway, AuthGateway } from './gateways'
import { useAccessToken } from './gateways/auth.gateway'

export const BASE_URL = import.meta.env.DEV ? 'http://localhost:3000' : ''

export class Client {
    public readonly auth = new AuthGateway()
    public readonly tasks = new TasksGateway()
    public readonly workers = new WorkersGateway()
}

export const client = signal<Client>(new Client())
export const useClient = () => client.value

export const fetchAuthed = async (
    input: RequestInfo,
    init?: RequestInit
): Promise<Response | null> => {
    const token = useAccessToken()
    if (!token) {
        return null
    }

    const headers: any = init?.headers || {}
    headers['Authorization'] = `Bearer ${token}`

    const response = await fetch(input, { ...init, headers })

    // Check if response is unauthorized
    if (response.status === 401) {
        return null
    }

    return response
}
