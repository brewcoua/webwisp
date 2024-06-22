import IAuthGateway from '@domain/gateways/auth.gateway'

export default class AuthGatewayMock implements IAuthGateway {
    async login() {
        return true
    }

    async logout() {
        return
    }

    async me() {
        return {
            id: 'edsqdqs',
            username: 'user',
        }
    }
}
