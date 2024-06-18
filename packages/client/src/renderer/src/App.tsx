import { Box, Flex } from '@chakra-ui/react'
import { Router } from 'preact-router'

import { Dashboard, Runner } from './pages'
import { Sidebar } from './components'
function App(): JSX.Element {
    return (
        <Flex minH="100vh">
            <Sidebar>
                <Box h="100%" w="100%">
                    <Router>
                        <Dashboard path="/" />
                        <Runner path="/run/:id" />
                    </Router>
                </Box>
            </Sidebar>
        </Flex>
    )
}

export default App
