import { Route, Switch } from 'wouter'
import { navigate } from 'wouter/use-browser-location'
import { Flex, Spinner, useToast } from '@chakra-ui/react'
import { useEffect, useState } from 'preact/hooks'

import Dashboard from './Dashboard'
import { useClient } from '@api/client'
import { setUser } from '@store/user'

export default function ProtectedPages() {
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    useEffect(() => {
        setIsLoading(true)
        const promise = new Promise<void>((resolve, reject) => {
            useClient()
                .auth.me()
                .then((user) => {
                    if (!user) {
                        navigate('/login')
                        reject()
                    } else {
                        setUser(user)
                        setIsLoading(false)
                        if (location.pathname === '/') {
                            navigate('/dashboard')
                        }
                        resolve()
                    }
                })
        })

        toast.promise(promise, {
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

    return (
        <Switch>
            <Route path="/dashboard" component={Dashboard} />
        </Switch>
    )
}
