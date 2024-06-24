import { Flex } from '@chakra-ui/react'
import { Switch, Route } from 'wouter'
import { ProtectedPages, PublicPages } from './pages'
import NotFound from './pages/NotFound'

export default function App() {
    return (
        <Flex h="100vh" w="100vw">
            <Switch>
                <Route path="/signup" component={PublicPages} />
                <Route path="/login" component={PublicPages} />

                <Route>
                    <Switch>
                        <Route path="/" component={ProtectedPages} />
                        <Route path="/dashboard" component={ProtectedPages} />
                        <Route component={NotFound} />
                    </Switch>
                </Route>
            </Switch>
        </Flex>
    )
}
