import { Box, Flex } from '@chakra-ui/react'
import { Router } from 'preact-router'
import { useEffect, useState } from 'preact/hooks'

import Credentials from '@common/Credentials'
import { Dashboard, Runner } from './pages'
import { CredentialsPrompt, Sidebar } from './components'
import { bindEvents } from './state/Runners'

function App(): JSX.Element {
  const [showCredentialsPrompt, setShowCredentialsPrompt] = useState(false)

  useEffect(() => {
    electron.ipcRenderer.send('app:loaded')
    setShowCredentialsPrompt(true)

    return bindEvents()
  }, [])

  const sendCredentials = (credentials: Credentials): void => {
    electron.ipcRenderer.send('credentials:save', credentials)
    setShowCredentialsPrompt(false)
  }

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
      <CredentialsPrompt isOpen={showCredentialsPrompt} onSubmit={sendCredentials} />
    </Flex>
  )
}

export default App
