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
    Input,
    useColorModeValue,
    Grid,
    GridItem,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from '@chakra-ui/react'
import { useEffect, useState } from 'preact/hooks'
import { MdRocketLaunch } from 'react-icons/md'

import BentoBox from '../BentoBox'
import { UserScopes } from '@domain/user.types'
import { ScenarioBase } from '@domain/scenario.base'
import { DatasetBase } from '@domain/dataset.base'
import { VWAClassifiedsScenario } from '@logic/scenarios'

export const scenarios: ScenarioBase<DatasetBase<any>>[] = [
    new VWAClassifiedsScenario(),
]

export default function LaunchScenario(): JSX.Element {
    const [selectedScenario, setSelectedScenario] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [isScenarioLoading, setIsScenarioLoading] = useState<boolean>(false)
    const [scenario, setScenario] = useState<ScenarioBase<
        DatasetBase<any>
    > | null>(null)
    const [scenarioTasks, setScenarioTasks] = useState<number>(1)
    const [maxScenarioTasks, setMaxScenarioTasks] = useState<number>(1)

    const onLaunch = async () => {
        setIsLoading(true)
        if (!scenario) {
            setIsLoading(false)
            return
        }

        await scenario.launch(scenarioTasks)

        setIsLoading(false)
    }

    useEffect(() => {
        setIsScenarioLoading(true)

        const foundScenario = scenarios.find((s) => s.id === selectedScenario)
        setScenario(foundScenario || null)

        if (foundScenario) {
            foundScenario.getTasksCount().then((tasks) => {
                setMaxScenarioTasks(tasks)
                setScenarioTasks(tasks)
                setIsScenarioLoading(false)
            })
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
                                onChange={(e) =>
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
                                    <Grid
                                        templateColumns="repeat(2, 1fr)"
                                        gap={3}
                                        alignItems="center"
                                        w="100%"
                                    >
                                        <GridItem>
                                            <FormControl isReadOnly>
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
                                        </GridItem>
                                        <GridItem>
                                            <FormControl>
                                                <FormLabel>
                                                    Tasks Count
                                                </FormLabel>{' '}
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
                                            </FormControl>
                                        </GridItem>
                                    </Grid>
                                </Flex>
                            )}
                        </Flex>
                    </Stack>
                    <Button
                        leftIcon={<MdRocketLaunch />}
                        colorScheme="blue"
                        isDisabled={!scenario || isLoading}
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
