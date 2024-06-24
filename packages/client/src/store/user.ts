import User from '@domain/User'
import { atom } from 'nanostores'

export const $user = atom<User | null>(null)

export function setUser(user: User) {
    $user.set(user)
}
