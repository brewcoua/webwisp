import { UserProps } from '@domain/user.types'
import { atom } from 'nanostores'

export const $user = atom<UserProps | null>(null)

export function setUser(user: UserProps) {
    $user.set(user)
}
