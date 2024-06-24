import PublicUser from './PublicUser'

export default interface User extends PublicUser {
    password: string
}
