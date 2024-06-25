import {
    AccordionPanel,
    AccordionPanelProps,
    Box,
    BoxProps,
    Flex,
    Icon,
    Link,
    Spinner,
    useColorModeValue,
} from '@chakra-ui/react'
import { TaskProps } from '@domain/task.types'
import { getTask } from '@store/tasks'
import { useEffect, useState } from 'preact/hooks'
import { FaExternalLinkAlt } from 'react-icons/fa'

export interface TaskDisplayProps extends AccordionPanelProps {
    task: string
}
export default function TaskDisplay({
    task,
    ...rest
}: TaskDisplayProps): JSX.Element {
    const [isLoading, setIsLoading] = useState(true)
    const [props, setProps] = useState<TaskProps | null>(null)

    useEffect(() => {
        getTask(task).then((task) => {
            setProps(task)
            setIsLoading(false)
        })
    }, [])

    if (isLoading) {
        return (
            <Flex h="5rem" w="100%" justify="center" align="center">
                <Spinner size="lg" />
            </Flex>
        )
    }

    if (!props) {
        return <Box {...rest}>Task not found</Box>
    }

    return (
        <AccordionPanel {...rest}>
            <TextDisplay icon={FaExternalLinkAlt} isLink>
                {props.target}
            </TextDisplay>
            <TextDisplay minH="5rem">{props.prompt}</TextDisplay>
        </AccordionPanel>
    )
}

export interface TextDisplayProps extends BoxProps {
    children: string
    icon?: React.ElementType
    isLink?: boolean
}
export function TextDisplay({
    children,
    icon,
    isLink,
    ...props
}: TextDisplayProps): JSX.Element {
    return (
        <Flex gap={2} alignItems="center">
            {icon && <Icon as={icon} fontSize="lg" />}
            <Box
                bg={useColorModeValue('gray.200', 'gray.600')}
                borderWidth={1}
                borderRadius="lg"
                padding={2}
                w="100%"
                {...props}
            >
                {isLink ? (
                    <Link href={children} isExternal>
                        {children}
                    </Link>
                ) : (
                    children
                )}
            </Box>
        </Flex>
    )
}
