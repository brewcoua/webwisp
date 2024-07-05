import { Flex } from '@chakra-ui/react'
import { Switch, Route } from 'wouter-preact'

import { Login, SignUp, NotFound, Dashboard } from './pages'
import { AuthedShell, UnauthedShell } from '@hoc'

export default function App() {
    return (
        <Flex h="100vh" w="100%">
            <Switch>
                <Route path="/">
                    <AuthedShell>
                        <Dashboard />
                    </AuthedShell>
                </Route>

                <Route path="/login">
                    <UnauthedShell>
                        <Login />
                    </UnauthedShell>
                </Route>
                <Route path="/signup">
                    <UnauthedShell>
                        <SignUp />
                    </UnauthedShell>
                </Route>
                <Route>
                    <UnauthedShell>
                        <NotFound />
                    </UnauthedShell>
                </Route>
            </Switch>
        </Flex>
    )
}
