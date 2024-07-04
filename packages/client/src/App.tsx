import { Flex } from '@chakra-ui/react'
import { Switch, Route } from 'wouter-preact'
import { Login, SignUp, NotFound } from './pages'
import { UnauthedShell } from '@hoc'

export default function App() {
    return (
        <Flex h="100vh" w="100%">
            <Switch>
                <Route path="/login">{UnauthedShell(<Login />)}</Route>
                <Route path="/signup">{UnauthedShell(<SignUp />)}</Route>

                <Route path="/"></Route>

                <Route>{UnauthedShell(<NotFound />)}</Route>

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
