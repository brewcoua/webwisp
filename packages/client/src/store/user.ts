import { useClient } from '@api/client'
import User from '@domain/User'
import { atom, onMount } from 'nanostores'
import { navigate } from 'wouter/use-browser-location'

export const $user = atom<User | null>(null)

export function setUser(user: User) {
    $user.set(user)
}

onMount($user, () => {
    useClient()
        .auth.me()
        .then((user) => {
            if (!user) {
                navigate('/login')
            }
            user && setUser(user)
        })

    return () => {
        $user.set(null)
    }
})
