import {
    Flex,
    FormControl,
    FormLabel,
    Button,
    Select,
    Heading,
    StackDivider,
    Stack,
    Text,
    Spinner,
    Link,
    useColorModeValue,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    useToast,
} from '@chakra-ui/react'
import { useEffect, useState } from 'preact/hooks'
import { MdRocketLaunch } from 'react-icons/md'

import BentoBox from '@features/ui/BentoBox'
import { UserScopes } from '@domain/user.types'
import { VWAClassifiedsScenario } from '@logic/scenarios'
import { ScenarioBase } from '@domain/logic/scenario.base'
import { useAppDispatch } from '@store/hooks'
import { createTask, createTaskBulk } from '../tasks.slice'
import { createGroup } from '../groups.slice'

export const scenarios: ScenarioBase<any, any, any>[] = [
    new VWAClassifiedsScenario(),
]

export const BULK_SIZE = 30

export default function LaunchScenario() {
    const [selectedScenario, setSelectedScenario] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [isScenarioLoading, setIsScenarioLoading] = useState<boolean>(false)
    const [scenario, setScenario] = useState<ScenarioBase<
        any,
        any,
        any
    > | null>(null)

    const [isBulk, setIsBulk] = useState<boolean>(false)

    const [scenarioTask, setScenarioTask] = useState<string | null>(null)
    const [scenarioTasks, setScenarioTasks] = useState<number>(1)
    const [maxScenarioTasks, setMaxScenarioTasks] = useState<number>(1)

    const dispatch = useAppDispatch()
    const toast = useToast()

    const onLaunch = async () => {
        setIsLoading(true)
        if (!scenario) {
            setIsLoading(false)
            return
        }

        if (isBulk) {
            let tasks = scenario.toTasks()
            tasks = tasks.slice(0, scenarioTasks)

            const group = await dispatch(
                createGroup({
                    name: `${scenario.name} (${scenarioTasks} tasks)`,
                })
            )
            if (!group) {
                setIsLoading(false)
                toast({
                    title: 'Error',
                    description: 'Failed to create task group',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                })
                return
            }

            tasks = tasks.map((task) => ({ ...task, group: group.id }))

            for (let i = 0; i < tasks.length; i += BULK_SIZE) {
                const bulk = tasks.slice(i, i + BULK_SIZE)

                const result = await dispatch(createTaskBulk(bulk))
                if (!result) {
                    setIsLoading(false)
                    toast({
                        title: 'Error',
                        description: 'Failed to create task bulk',
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    })
                    return
                }

                console.log(
                    `Sent bulk of ${bulk.length} tasks with group ${group.id}`
                )
            }
        } else {
            const taskId = scenarioTask || scenario.entities[0].id
            const task = scenario.entities.find((t) => t.id === taskId)

            if (!task) {
                setIsLoading(false)
                toast({
                    title: 'Error',
                    description: 'Task not found',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                })
                return
            }

            const result = await dispatch(createTask(task.toTask()))

            if (!result) {
                setIsLoading(false)
                toast({
                    title: 'Error',
                    description: 'Failed to create task',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                })
                return
            }
        }

        setIsLoading(false)
    }

    useEffect(() => {
        setIsScenarioLoading(true)

        const foundScenario = scenarios.find((s) => s.id === selectedScenario)
        setScenario(foundScenario || null)

        if (foundScenario) {
            ;(async () => {
                scenario?.clear()
                await foundScenario.initialize()
                const tasks = foundScenario.entities.length

                setMaxScenarioTasks(tasks)
                setScenarioTasks(tasks)

                setIsScenarioLoading(false)
            })()
        } else {
            setIsScenarioLoading(false)
        }
    }, [selectedScenario])

    return (
        <BentoBox
            h="50%"
            gap={5}
            p={3}
            justifyContent="space-between"
            scope={UserScopes.EDIT}
        >
            <Flex direction="column" gap={3} h="100%">
                <Flex>
                    <Heading size="md">Launch Scenario</Heading>
                </Flex>
                <Flex
                    direction="column"
                    gap={3}
                    justify="space-between"
                    h="100%"
                >
                    <Stack divider={<StackDivider />} spacing={4}>
                        <FormControl isRequired={true}>
                            <FormLabel>Scenario</FormLabel>
                            <Select
                                placeholder="Select scenario"
                                onChange={(e: any) =>
                                    setSelectedScenario(e.target.value)
                                }
                                value={selectedScenario}
                            >
                                {scenarios.map((scenario) => (
                                    <option
                                        key={scenario.id}
                                        value={scenario.id}
                                    >
                                        {scenario.name}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                        <Flex direction="column" h="100%">
                            {(!scenario || isScenarioLoading) && (
                                <Flex
                                    justify="center"
                                    align="center"
                                    h="100%"
                                    w="100%"
                                >
                                    {!scenario && (
                                        <Text>Select a scenario to launch</Text>
                                    )}
                                    {isScenarioLoading && <Spinner size="lg" />}
                                </Flex>
                            )}
                            {scenario && !isScenarioLoading && (
                                <Flex direction="column" gap={3}>
                                    <Flex direction="column" gap={4} w="100%">
                                        <FormControl isReadOnly minW="50%">
                                            <FormLabel>Dataset</FormLabel>
                                            <Link
                                                href={scenario.dataset.url}
                                                isExternal
                                                border="1px solid"
                                                borderColor={useColorModeValue(
                                                    'gray.200',
                                                    'gray.700'
                                                )}
                                                px={4}
                                                py={2}
                                                borderRadius="md"
                                                display="block"
                                            >
                                                {scenario.dataset.name}
                                            </Link>
                                        </FormControl>
                                        <Flex gap={2}>
                                            <FormControl
                                                isRequired
                                                w="20%"
                                                minW="8rem"
                                            >
                                                <FormLabel>
                                                    Launch Type
                                                </FormLabel>
                                                <Select
                                                    placeholder="Select launch type"
                                                    defaultValue={'single'}
                                                    onChange={(e: any) => {
                                                        if (
                                                            e.target.value !==
                                                                'single' &&
                                                            e.target.value !==
                                                                'bulk'
                                                        ) {
                                                            e.target.value =
                                                                'single'
                                                        }

                                                        setIsBulk(
                                                            e.target.value ===
                                                                'bulk'
                                                        )
                                                    }}
                                                >
                                                    <option value="single">
                                                        Single
                                                    </option>
                                                    <option value="bulk">
                                                        Bulk
                                                    </option>
                                                </Select>
                                            </FormControl>
                                            <FormControl isRequired>
                                                <FormLabel>
                                                    {isBulk
                                                        ? 'Tasks Count'
                                                        : 'Task ID'}
                                                </FormLabel>{' '}
                                                {isBulk ? (
                                                    <NumberInput
                                                        defaultValue={
                                                            maxScenarioTasks
                                                        }
                                                        min={1}
                                                        max={maxScenarioTasks}
                                                        onChange={(value) =>
                                                            setScenarioTasks(
                                                                parseInt(value)
                                                            )
                                                        }
                                                    >
                                                        <NumberInputField />
                                                        <NumberInputStepper>
                                                            <NumberIncrementStepper />
                                                            <NumberDecrementStepper />
                                                        </NumberInputStepper>
                                                    </NumberInput>
                                                ) : (
                                                    <Select
                                                        placeholder="Select task"
                                                        onChange={(e: any) =>
                                                            setScenarioTask(
                                                                e.target.value
                                                            )
                                                        }
                                                        value={
                                                            scenarioTask ??
                                                            scenario.entities[0]
                                                                .id
                                                        }
                                                    >
                                                        {scenario.entities.map(
                                                            (entity) => {
                                                                let prompt =
                                                                    entity.toTask()
                                                                        .prompt
                                                                if (
                                                                    prompt.length >
                                                                    80
                                                                ) {
                                                                    prompt =
                                                                        prompt.slice(
                                                                            0,
                                                                            80
                                                                        ) +
                                                                        '...'
                                                                }

                                                                return (
                                                                    <option
                                                                        key={
                                                                            entity.id
                                                                        }
                                                                        value={
                                                                            entity.id
                                                                        }
                                                                    >
                                                                        {
                                                                            entity.id
                                                                        }{' '}
                                                                        -{' '}
                                                                        {prompt}
                                                                    </option>
                                                                )
                                                            }
                                                        )}
                                                    </Select>
                                                )}
                                            </FormControl>
                                        </Flex>
                                    </Flex>
                                </Flex>
                            )}
                        </Flex>
                    </Stack>
                    <Button
                        leftIcon={<MdRocketLaunch />}
                        colorScheme="blue"
                        isDisabled={
                            !scenario ||
                            isLoading ||
                            (isBulk && !scenarioTasks) ||
                            (!isBulk && !scenarioTask)
                        }
                        isLoading={isLoading}
                        onClick={onLaunch}
                    >
                        Launch
                    </Button>
                </Flex>
            </Flex>
        </BentoBox>
    )
}
