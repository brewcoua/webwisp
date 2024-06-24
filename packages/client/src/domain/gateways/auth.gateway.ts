import User from '@domain/User'

export default interface IAuthGateway {
    login(username: string, password: string): Promise<boolean>
    signup(username: string, password: string): Promise<boolean>
    logout(): Promise<void>
    me(): Promise<User | null>
}
