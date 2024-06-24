import { Flex } from '@chakra-ui/react'
import { Switch, Route } from 'wouter'

import { Dashboard, Login } from './pages'

export default function App() {
    return (
        <Flex h="100vh" w="100vw">
            <Switch>
                <Route path="/" component={Dashboard} />
                <Route path="/login" component={Login} />
                <Route>
                    <div>404</div>
                </Route>
            </Switch>
        </Flex>
    )
}
