import { fetchAuthed } from '@api/client'
import User from '@domain/User'
import IAuthGateway from '@domain/gateways/auth.gateway'

export default class AuthGateway implements IAuthGateway {
    async login(username: string, password: string): Promise<boolean> {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })

        if (!response.ok) {
            return false
        }

        const data = await response.json()
        setAccessToken(data.access_token)

        return true
    }

    async logout(): Promise<void> {
        await fetchAuthed('/api/auth/logout')
    }

    async me(): Promise<User | null> {
        const response = await fetchAuthed('/api/auth/me')

        if (!response?.ok) {
            return null
        }

        return response.json()
    }
}

export const useAccessToken = (): string | null => {
    return localStorage.getItem('access-token')
}
export const setAccessToken = (token: string): void => {
    localStorage.setItem('access-token', token)
}