import { Flex, Spinner, useToast } from '@chakra-ui/react'
import { useEffect, useState } from 'preact/compat'
import { navigate } from 'wouter-preact/use-browser-location'

import { fetchUser } from '@features/users/user.slice'
import { useAppDispatch } from '@store/hooks'

export const AuthenticationProvider = ({ children }: { children: any }) => {
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useAppDispatch()
    const toast = useToast()

    useEffect(() => {
        const load = new Promise<void>(async (resolve, reject) => {
            const result = await dispatch(fetchUser())
            if (result) {
                setIsLoading(false)
                resolve()
            } else {
                navigate('/login')
                reject()
            }
        })

        toast.promise(load, {
            success: {
                title: 'Successfully authenticated',
                description: 'Welcome back!',
            },
            loading: {
                title: 'Checking authentication...',
                description: 'Please wait.',
            },
            error: {
                title: 'Failed to authenticate',
                description: 'Please login again',
            },
        })
    }, [])

    if (isLoading) {
        return (
            <Flex justify="center" align="center" h="100%" w="100%">
                <Spinner size="xl" />
            </Flex>
        )
    }

    return children
}

export default AuthenticationProvider
