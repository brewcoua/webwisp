import { UserProps } from '@domain/user.types'

export default interface IAuthGateway {
    login(username: string, password: string): Promise<boolean>
    signup(username: string, password: string): Promise<boolean>
    logout(): Promise<void>
    me(): Promise<UserProps | null>
}
