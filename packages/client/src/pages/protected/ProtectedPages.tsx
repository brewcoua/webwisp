import { Route, Switch } from 'wouter'
import { navigate } from 'wouter/use-browser-location'
import { Flex, Spinner } from '@chakra-ui/react'
import { useEffect, useState } from 'preact/hooks'

import Dashboard from './Dashboard'
import { useClient } from '@api/client'
import { useAccessToken } from '@api/gateways/auth.gateway'
import { setUser } from '@store/user'

export default function ProtectedPages() {
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!useAccessToken()) {
            return navigate('/login')
        }

        setIsLoading(true)
        useClient()
            .auth.me()
            .then((user) => {
                if (!user) {
                    navigate('/login')
                } else {
                    setUser(user)
                    setIsLoading(false)
                    if (location.pathname === '/') {
                        navigate('/dashboard')
                    }
                }
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
