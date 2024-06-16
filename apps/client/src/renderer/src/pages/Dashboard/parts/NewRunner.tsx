import { Flex, Input, FormControl, FormLabel, Textarea, Button } from '@chakra-ui/react'
import { useState } from 'preact/hooks'
import { MdRocketLaunch } from 'react-icons/md'

import Events from '../../../../../common/Events'
import BentoBox from '../BentoBox'

export default function NewRunner(): JSX.Element {
  const [target, setTarget] = useState<string>('')
  const [task, setTask] = useState<string>('')
  const [isLaunching, setIsLaunching] = useState(false)

  const isTargetValid = ((): boolean => {
    try {
      new URL(target)
      return true
    } catch {
      return false
    }
  })()
  const isTaskValid = task.length > 0 && task.trim().split(' ').length >= 3

  const onLaunch = (): void => {
    console.log('Launching', target, task)
    electron.ipcRenderer.send(Events.RUNNER_SPAWN, target, task)
    setIsLaunching(true)
    electron.ipcRenderer.once(Events.RUNNER_ADDED, () => {
      setIsLaunching(false)
    })
  }

  return (
    <BentoBox h="50%" gap={5} justifyContent="space-between" header="New Runner">
      <Flex direction="column" gap={3}>
        <FormControl isRequired={true}>
          <FormLabel>Target</FormLabel>
          <Input
            type="url"
            placeholder="https://example.com"
            onChange={(e) => setTarget(e.target.value)}
            value={target}
          />
        </FormControl>
        <FormControl isRequired={true}>
          <FormLabel>Task</FormLabel>
          <Textarea
            placeholder="Check that the page loads"
            onChange={(e) => setTask(e.target.value)}
            value={task}
            size="sm"
            rows={3}
            resize="none"
          />
        </FormControl>
      </Flex>
      <Button
        leftIcon={<MdRocketLaunch />}
        colorScheme="blue"
        isDisabled={!isTargetValid || !isTaskValid}
        isLoading={isLaunching}
        onClick={onLaunch}
      >
        Launch
      </Button>
    </BentoBox>
  )
}
