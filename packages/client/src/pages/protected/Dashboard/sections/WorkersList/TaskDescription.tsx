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
import { FaExternalLinkAlt } from 'react-icons/fa'

import PopulatedTask from '@domain/PopulatedTask'

export interface TaskDescriptionProps extends AccordionPanelProps {
    task: PopulatedTask
}

export default function TaskDescription({
    task,
    ...props
}: TaskDescriptionProps): JSX.Element {
    return (
        <AccordionPanel display="flex" flexDir="column" gap={2} {...props}>
            <TextDisplay icon={FaExternalLinkAlt} isLink>
                {task.target}
            </TextDisplay>
            <TextDisplay minH="5rem">{task.prompt}</TextDisplay>
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
