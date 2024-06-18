import { Flex } from '@chakra-ui/react'

import Preview from './Preview'
import { useRunner } from '@renderer/state/Runners'

export interface RunnerPageProps {
  id: string
}

export default function Runner({ id }: RunnerPageProps): JSX.Element {
  const runner = useRunner(parseInt(id))
  if (!runner) {
    return <Flex>Runner not found</Flex>
  }

  // Top is a webview for the runner page
  // Bottom is a listing of actions, and a result if any
  return (
    <Flex direction="column" height="100%">
      <Preview url={runner?.remoteUrl || ''} />
    </Flex>
  )
}
