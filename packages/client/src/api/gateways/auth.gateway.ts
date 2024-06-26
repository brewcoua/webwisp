import { BASE_URL, fetchAuthed } from '@api/client'
import IAuthGateway from '@domain/api/gateways/auth.gateway'
import { UserProps } from '@domain/user.types'

export default class AuthGateway implements IAuthGateway {
    async login(username: string, password: string): Promise<boolean> {
        const response = await fetch(`${BASE_URL}/api/auth/login`, {
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

    async signup(username: string, password: string): Promise<boolean> {
        const response = await fetch(`${BASE_URL}/api/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })

        return response.ok
    }

    async logout(): Promise<void> {
        deleteAccessToken()
    }

    async me(): Promise<UserProps | null> {
        const response = await fetchAuthed(`${BASE_URL}/api/auth/me`)

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
export const deleteAccessToken = (): void => {
    localStorage.removeItem('access-token')
}
