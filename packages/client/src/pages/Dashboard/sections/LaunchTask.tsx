import {
    Flex,
    Input,
    FormControl,
    FormLabel,
    Textarea,
    Button,
} from '@chakra-ui/react'
import { useState } from 'preact/hooks'
import { MdRocketLaunch } from 'react-icons/md'

import BentoBox from '../BentoBox'
import { useClient } from '@api/client'

export default function LaunchTask(): JSX.Element {
    const [target, setTarget] = useState<string>('')
    const [prompt, setPrompt] = useState<string>('')
    const [isLaunching, setIsLaunching] = useState(false)

    const isTargetValid = ((): boolean => {
        try {
            new URL(target)
            return true
        } catch {
            return false
        }
    })()
    const isPromptValid =
        prompt.length > 0 && prompt.trim().split(' ').length >= 3

    const onLaunch = async (): Promise<void> => {
        const client = useClient()
        setIsLaunching(true)

        try {
            await client.tasks.createTask({ target, prompt })
            setTarget('')
            setPrompt('')
        } catch (e) {
            console.error(e)
        } finally {
            setIsLaunching(false)
        }
    }

    return (
        <BentoBox
            h="50%"
            gap={5}
            justifyContent="space-between"
            header="Queue a new task"
        >
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
                    <FormLabel>Prompt</FormLabel>
                    <Textarea
                        placeholder="Check that the page loads."
                        onChange={(e) => setPrompt(e.target.value)}
                        value={prompt}
                        size="sm"
                        rows={3}
                        resize="none"
                    />
                </FormControl>
            </Flex>
            <Button
                leftIcon={<MdRocketLaunch />}
                colorScheme="blue"
                isDisabled={!isTargetValid || !isPromptValid}
                isLoading={isLaunching}
                onClick={onLaunch}
            >
                Launch
            </Button>
        </BentoBox>
    )
}
