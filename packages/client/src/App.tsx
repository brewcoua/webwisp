import { Flex } from '@chakra-ui/react'
import { Switch, Route } from 'wouter'

import { Dashboard } from './pages'

export default function App() {
    return (
        <Flex h="100vh" w="100vw">
            <Switch>
                <Route path="/" component={Dashboard} />
                <Route>
                    <div>404</div>
                </Route>
            </Switch>
        </Flex>
    )
}
