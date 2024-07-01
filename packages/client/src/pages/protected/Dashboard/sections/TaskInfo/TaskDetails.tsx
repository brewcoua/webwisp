import {
    Box,
    Code,
    Flex,
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

export interface TaskDetailsProps {
    task: TaskProps
}

export default function TaskDetails({ task }: TaskDetailsProps): JSX.Element {
    const details = (
        <>
            <b>id:</b> {task.id}
            {task.correlation && (
                <>
                    <br />
                    <b>correlation:</b> {task.correlation}
                </>
            )}
            <br />
            <b>status:</b> {task.status}
            <br />
            <b>target: </b>
            <Link href={task.target} isExternal>
                {task.target}
            </Link>
            <br />
            <b>prompt:</b> {task.prompt}
            {task.message && (
                <>
                    <br />
                    <br />
                    <b>message:</b> {task.message}
                </>
            )}
            {task.value && (
                <>
                    <br />
                    <b>value:</b> {task.value}
                </>
            )}
            {task.difficulty && (
                <>
                    <br />
                    <br />
                    <b>difficulty:</b> {task.difficulty.visual_difficulty} /{' '}
                    {task.difficulty.reasoning_difficulty} /{' '}
                    {task.difficulty.overall_difficulty}
                    <br />
                </>
            )}
            {task.evaluation && (
                <>
                    <br />
                    <b>evaluation:</b>
                    <Flex ml={3} direction="column">
                        <Box>
                            <b>results: </b>
                            {task.evaluation.results
                                .reduce((acc, res) => acc + res.score, 0)
                                .toString() + ' '}
                            / {task.evaluation.results.length}
                        </Box>
                        <b>config:</b>
                        <Flex ml={3} direction="column">
                            {task.evaluation.config.eval_types.map((type) => (
                                <Box>
                                    <b>{type}: </b>
                                    {task.evaluation?.results.find(
                                        (res) => res.type === type
                                    )?.score || 'N/A'}
                                </Box>
                            ))}
                        </Flex>
                    </Flex>
                </>
            )}
        </>
    )

    return (
        <Stack
            spacing={4}
            divider={<StackDivider />}
            direction="column"
            h="100%"
            w="100%"
        >
            <Code
                h="100%"
                w="100%"
                display="block"
                whiteSpace="pre"
                wordBreak="break-word"
            >
                {details}
            </Code>
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
