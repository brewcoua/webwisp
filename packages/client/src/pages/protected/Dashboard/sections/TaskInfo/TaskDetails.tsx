import {
    Code,
    Flex,
    Heading,
    Icon,
    IconProps,
    Link,
    Stack,
    StackDivider,
    Text,
    useColorModeValue,
} from '@chakra-ui/react'
import { TaskProps } from '@domain/task.types'

import { IconType } from 'react-icons/lib'
import { PiIdentificationBadge } from 'react-icons/pi'
import { FaLink } from 'react-icons/fa'

export interface TaskDetailsProps {
    task: TaskProps
}

export default function TaskDetails({ task }: TaskDetailsProps): JSX.Element {
    return (
        <Stack
            spacing={4}
            divider={<StackDivider />}
            direction="column"
            h="100%"
            w="100%"
        >
            <Flex
                direction="column"
                align="flex-start"
                justify="flex-start"
                gap={2}
                w="100%"
            >
                <Heading size="md">Task Details</Heading>
                <Flex
                    direction="column"
                    align="flex-start"
                    justify="flex-start"
                    gap={2.5}
                    bg={useColorModeValue('gray.100', 'gray.800')}
                    p={2}
                    borderRadius="md"
                    w="100%"
                >
                    <Stack
                        direction="row"
                        align="center"
                        justify="flex-start"
                        spacing={3}
                        divider={<StackDivider />}
                    >
                        <DetailsField
                            icon={PiIdentificationBadge}
                            iconColor={useColorModeValue(
                                'grey.200',
                                'grey.800'
                            )}
                            label="ID"
                            value={task.id}
                        />
                        <DetailsField
                            icon={FaLink}
                            iconColor={useColorModeValue(
                                'blue.500',
                                'blue.300'
                            )}
                            label="Correlation"
                            value={task.correlation || 'none'}
                        />
                    </Stack>
                    <DetailsField label="Status" value={task.status} />
                    <DetailsField label="Target" value={task.target} isLink />
                    <DetailsField label="Prompt" value={task.prompt} isArea />
                </Flex>
            </Flex>

            {(task.evaluation || task.difficulty) && (
                <Flex
                    direction="column"
                    align="flex-start"
                    justify="flex-start"
                    gap={2}
                    w="100%"
                >
                    <Heading size="md">Task Evaluation</Heading>
                    <Stack
                        direction="column"
                        align="flex-start"
                        justify="flex-start"
                        gap={2.5}
                        bg={useColorModeValue('gray.100', 'gray.800')}
                        p={2}
                        borderRadius="md"
                        w="100%"
                        divider={<StackDivider />}
                    >
                        {task.difficulty && (
                            <Flex
                                direction="column"
                                align="flex-start"
                                justify="flex-start"
                                gap={1}
                            >
                                <Heading size="sm">Difficulty</Heading>
                                <Flex
                                    direction="column"
                                    align="flex-start"
                                    justify="flex-start"
                                    gap={2}
                                >
                                    <DetailsField
                                        label="Reasoning"
                                        value={
                                            task.difficulty.reasoning_difficulty
                                        }
                                    />
                                    <DetailsField
                                        label="Visual"
                                        value={
                                            task.difficulty.visual_difficulty
                                        }
                                    />
                                    <DetailsField
                                        label="Overall"
                                        value={
                                            task.difficulty.overall_difficulty
                                        }
                                    />
                                </Flex>
                            </Flex>
                        )}
                        {task.evaluation && (
                            <Flex
                                direction="column"
                                align="flex-start"
                                justify="flex-start"
                                gap={1}
                            >
                                <Heading size="sm">Evaluation</Heading>
                                <Flex
                                    direction="column"
                                    align="flex-start"
                                    justify="flex-start"
                                    gap={2}
                                >
                                    {task.evaluation.results.map(
                                        (result, index) => (
                                            <DetailsField
                                                key={index}
                                                label={result.type}
                                                value={result.score.toString()}
                                            />
                                        )
                                    )}
                                    {task.evaluation.results.length === 0 && (
                                        <Text>No evaluation results</Text>
                                    )}
                                </Flex>
                            </Flex>
                        )}
                    </Stack>
                </Flex>
            )}
        </Stack>
    )
}

export interface DetailsFieldProps {
    icon?: IconType
    iconColor?: IconProps['color']
    label: string
    value: string
    isLink?: boolean
    isArea?: boolean
}

export function DetailsField({
    icon,
    iconColor,
    label,
    value,
    isLink,
    isArea,
}: DetailsFieldProps): JSX.Element {
    const TextComponent = isLink ? (
        <Link
            href={value}
            isExternal
            bg={useColorModeValue('gray.300', 'gray.600')}
            px={2}
            py={1}
            borderRadius="md"
        >
            {value}
        </Link>
    ) : (
        <Text
            bg={useColorModeValue('gray.300', 'gray.600')}
            px={2}
            py={1}
            borderRadius="md"
        >
            {value}
        </Text>
    )

    if (isArea) {
        return (
            <Stack direction="column" spacing={1}>
                <Flex align="center" justify="flex-start" gap={1.5}>
                    {icon && <Icon as={icon} color={iconColor} />}
                    <Text>{label} :</Text>
                </Flex>
                <Text
                    bg={useColorModeValue('gray.300', 'gray.600')}
                    px={2}
                    py={1}
                    borderRadius="md"
                    minH="5rem"
                    minW="20rem"
                >
                    {value}
                </Text>
            </Stack>
        )
    }

    return (
        <Stack direction="row" spacing={2}>
            <Flex align="center" justify="flex-start" gap={1.5}>
                {icon && <Icon as={icon} color={iconColor} />}
                <Text>{label} :</Text>
            </Flex>
            {TextComponent}
        </Stack>
    )
}
