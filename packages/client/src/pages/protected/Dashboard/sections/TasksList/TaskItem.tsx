import {
    Button,
    ButtonProps,
    Flex,
    Icon,
    IconProps,
    Link,
    Spinner,
    Text,
    Tooltip,
    useColorModeValue,
} from '@chakra-ui/react'
import { TaskProps, TaskStatus } from '@domain/task.types'

import { MdOutlinePending } from 'react-icons/md'
import { IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5'
import { selectedTask } from './TasksList'

export interface TaskItemProps extends ButtonProps {
    task: TaskProps
}

export default function TaskItem({
    task,
    ...props
}: TaskItemProps): JSX.Element {
    return (
        <Tooltip
            label={task.id}
            aria-label={task.id}
            bg={useColorModeValue('gray.400', 'gray.500')}
            color={useColorModeValue('gray.800', 'gray.200')}
            fontSize="sm"
            borderRadius="md"
            hasArrow
            placement="right"
            openDelay={300}
        >
            <Button
                bg={useColorModeValue('gray.200', 'gray.600')}
                opacity={selectedTask.value === task.id ? 1 : 0.7}
                _hover={{
                    opacity: selectedTask.value === task.id ? 1 : 0.9,
                }}
                _active={{
                    bg: useColorModeValue('gray.200', 'gray.600'),
                    scale: 0.8,
                }}
                transition="scale 0.1s"
                display="flex"
                align="center"
                justify="space-between"
                onClick={() => {
                    selectedTask.value = task.id
                }}
                {...props}
            >
                <Flex direction="row" gap={2} w="100%" h="100%">
                    <Flex w="1rem" h="100%" align="center" justify="center">
                        <TaskStatusIcon status={task.status} />
                    </Flex>
                    <Flex direction="column" gap={1} align="flex-start">
                        <Link
                            fontSize="xs"
                            isExternal
                            color={useColorModeValue('blue.500', 'blue.300')}
                            href={task.target}
                        >
                            {task.target}
                        </Link>
                        <Text fontSize="sm" maxWidth="100%">
                            {task.prompt}
                        </Text>
                    </Flex>
                </Flex>
            </Button>
        </Tooltip>
    )
}

export interface TaskStatusIconProps extends IconProps {
    status: TaskStatus
}
export function TaskStatusIcon({
    status,
    ...props
}: TaskStatusIconProps): JSX.Element {
    if (status === TaskStatus.PENDING) {
        return (
            <Icon
                as={MdOutlinePending}
                color={useColorModeValue('gray.500', 'gray.300')}
            />
        )
    } else if (status === TaskStatus.RUNNING) {
        return (
            <Spinner
                size="sm"
                color={useColorModeValue('gray.500', 'gray.300')}
            />
        )
    } else if (status === TaskStatus.COMPLETED) {
        return (
            <Icon
                as={IoCheckmarkCircle}
                color={useColorModeValue('green.500', 'green.300')}
            />
        )
    } else {
        return (
            <Icon
                as={IoCloseCircle}
                color={useColorModeValue('red.500', 'red.300')}
            />
        )
    }
}
