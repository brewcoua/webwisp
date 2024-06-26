import {
    Flex,
    Input,
    FormControl,
    FormLabel,
    Textarea,
    Button,
    Heading,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
} from '@chakra-ui/react'
import { useState } from 'preact/hooks'
import { MdRocketLaunch } from 'react-icons/md'

import BentoBox from '../BentoBox'
import { useClient } from '@api/client'
import { UserScopes } from '@domain/user.types'

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
            p={3}
            justifyContent="space-between"
            scope={UserScopes.EDIT}
        >
            <Flex direction="column" gap={2} h="100%">
                <Flex align="center" justify="space-between">
                    <Heading size="md">Launch Task</Heading>
                    <Menu>
                        <MenuButton as={Button}>Presets</MenuButton>
                        <MenuList alignItems="center">
                            {Object.entries(Presets).map(([key, value]) => (
                                <MenuItem
                                    key={key}
                                    onClick={() => {
                                        setTarget(value.target)
                                        setPrompt(value.prompt)
                                    }}
                                    flexDir="row"
                                    alignItems="center"
                                    justifyContent="flex-start"
                                >
                                    {value.name}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                </Flex>
                <Flex
                    direction="column"
                    gap={3}
                    justify="space-between"
                    h="100%"
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
                </Flex>
            </Flex>
        </BentoBox>
    )
}

const Presets = {
    demo3: {
        name: 'Demo 3',
        target: 'https://www.labri.fr/en',
        prompt: 'Go to the MENU, then to the Awards, check that Yvonne Jansen is in the list',
    },
}
