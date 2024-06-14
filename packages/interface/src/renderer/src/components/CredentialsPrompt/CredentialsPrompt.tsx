import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  useColorModeValue
} from '@chakra-ui/react'
import Credentials from '@common/Credentials'
import { useMemo, useState, useEffect } from 'preact/hooks'

export interface CredentialsPromptProps {
  isOpen: boolean
  onSubmit: (credentials: Credentials) => void
}

export default function CredentialsPrompt({
  isOpen,
  onSubmit
}: CredentialsPromptProps): JSX.Element {
  const [apiKey, setApiKey] = useState<string>('')
  const [organizationID, setOrganizationID] = useState<string>('')
  const [projectID, setProjectID] = useState<string>('')

  useEffect(() => {
    electron.ipcRenderer.on('credentials:load', (_, credentials: Credentials) => {
      setApiKey(credentials.apiKey)
      setOrganizationID(credentials.organizationId || '')
      setProjectID(credentials.projectId || '')
    })
  })

  const isAPIKeyValid = useMemo(() => apiKey && apiKey.trim().length > 16, [apiKey])
  const isOrganizationIDValid = useMemo(
    () => !organizationID || organizationID.match(/^org-[a-zA-Z0-9]{24}$/),
    [organizationID]
  )
  const isProjectIDValid = useMemo(
    () => !projectID || projectID.match(/^proj_[a-zA-Z0-9]{24}$/),
    [projectID]
  )

  return (
    <Modal isOpen={isOpen} onClose={() => {}}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Enter your credentials</ModalHeader>
        <ModalBody>
          <FormControl isRequired={true} isInvalid={!isAPIKeyValid}>
            <FormLabel>API Key</FormLabel>
            <Input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
          </FormControl>
          <FormControl mt={3} isInvalid={!isOrganizationIDValid}>
            <FormLabel>Organization ID</FormLabel>
            <Input
              type="text"
              value={organizationID}
              onChange={(e) => setOrganizationID(e.target.value)}
            />
            {isOrganizationIDValid ? null : (
              <FormHelperText color={useColorModeValue('red.500', 'red.300')}>
                Organization ID does not match the expected format (org-XXXXXXXXXXXXXXXXXXXXXXXX)
              </FormHelperText>
            )}
          </FormControl>
          <FormControl mt={3} isInvalid={!isProjectIDValid}>
            <FormLabel>Project ID</FormLabel>
            <Input type="text" value={projectID} onChange={(e) => setProjectID(e.target.value)} />
            {isProjectIDValid ? null : (
              <FormHelperText color={useColorModeValue('red.500', 'red.300')}>
                Project ID does not match the expected format (proj_XXXXXXXXXXXXXXXXXXXXXXXX)
              </FormHelperText>
            )}
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() =>
              onSubmit({ apiKey, organizationId: organizationID, projectId: projectID })
            }
            disabled={!isAPIKeyValid || !isOrganizationIDValid || !isProjectIDValid}
          >
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
