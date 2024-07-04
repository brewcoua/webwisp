import {
    AccordionPanel,
    AccordionPanelProps,
    Box,
    BoxProps,
    Flex,
    Icon,
    Link,
    useColorModeValue,
} from '@chakra-ui/react'
import { IconType } from 'react-icons'
import { FaExternalLinkAlt } from 'react-icons/fa'

import { useTask } from '@features/tasks/tasks.slice'

export interface TaskDisplayProps extends AccordionPanelProps {
    task_id: string
}
export default function TaskDisplay({ task_id, ...rest }: TaskDisplayProps) {
    const task = useTask(task_id)

    if (!task) {
        return (
            <AccordionPanel
                h="5rem"
                w="100%"
                display="flex"
                justifyContent="center"
                alignItems="center"
                {...rest}
            >
                Task not found
            </AccordionPanel>
        )
    }

    return (
        <AccordionPanel display="flex" flexDirection="column" gap={2} {...rest}>
            <TextDisplay icon={FaExternalLinkAlt} isLink>
                {task.target}
            </TextDisplay>
            <TextDisplay minH="5rem">{task.prompt}</TextDisplay>
        </AccordionPanel>
    )
}

export interface TextDisplayProps extends BoxProps {
    children: string
    icon?: IconType
    isLink?: boolean
}
export function TextDisplay({
    children,
    icon,
    isLink,
    ...props
}: TextDisplayProps) {
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
