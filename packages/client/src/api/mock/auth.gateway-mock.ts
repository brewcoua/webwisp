import { deleteAccessToken, setAccessToken } from '@api/gateways/auth.gateway'
import IAuthGateway from '@domain/api/gateways/auth.gateway'
import { UserScopes } from '@domain/user.types'

export default class AuthGatewayMock implements IAuthGateway {
    async login() {
        setAccessToken('token')
        return true
    }

    async signup() {
        return true
    }

    async logout() {
        deleteAccessToken()
    }

    async me() {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return {
            id: 'edsqdqs',
            username: 'user',
            displayName: 'User',
            scopes: [UserScopes.VIEW, UserScopes.EDIT],
        }
    }
}
