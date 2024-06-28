import {
    Button,
    ButtonProps,
    Flex,
    Icon,
    IconButton,
    IconProps,
    Link,
    SlideFade,
    Spinner,
    Text,
    Tooltip,
    useColorModeValue,
} from '@chakra-ui/react'
import { useStore } from '@nanostores/preact'
import { $user } from '@store/user'

import { TaskProps, TaskStatus } from '@domain/task.types'

import { MdOutlinePending } from 'react-icons/md'
import { IoCheckmarkCircle, IoCloseCircle, IoTrash } from 'react-icons/io5'

import { UserScopes } from '@domain/user.types'
import { $selected_task } from '@store/selected_task'

export interface TaskItemProps extends ButtonProps {
    task: TaskProps
    onTaskClick?: (task: TaskProps) => void
    onDelete?: (task: TaskProps) => void
    isDeleting?: boolean
}

export default function TaskItem({
    task,
    onTaskClick,
    onDelete,
    isDeleting,
    ...props
}: TaskItemProps): JSX.Element {
    const user = useStore($user)
    const selectedTask = useStore($selected_task)

    const isEditable =
        user?.scopes.includes(UserScopes.EDIT) &&
        [TaskStatus.COMPLETED, TaskStatus.FAILED].includes(task.status)

    return (
        <SlideFade in offsetY="20px" style={{ width: '100%' }}>
            <Button
                bg={useColorModeValue('gray.200', 'gray.600')}
                opacity={selectedTask === task.id ? 1 : 0.7}
                _hover={{
                    opacity: selectedTask === task.id ? 1 : 0.9,
                }}
                _active={{
                    bg: useColorModeValue('gray.200', 'gray.600'),
                    scale: 0.8,
                }}
                transition="scale 0.1s"
                display="flex"
                align="center"
                justify="space-between"
                borderRadius="md"
                onClick={() => {
                    if (onTaskClick) {
                        onTaskClick(task)
                    }
                }}
                isDisabled={isDeleting}
                px={1}
                pl={2}
                {...props}
            >
                <Flex direction="row" gap="0.5rem" w="100%" h="100%">
                    <Flex w="1.5rem" h="100%" align="center" justify="center">
                        <TaskStatusIcon
                            status={task.status}
                            h="100%"
                            w="100%"
                        />
                    </Flex>
                    <Flex
                        direction="column"
                        gap={1}
                        align="flex-start"
                        w={
                            isEditable
                                ? 'calc(100% - 4.5rem)'
                                : 'calc(100% - 2.5rem)'
                        }
                    >
                        <Link
                            fontSize="xs"
                            isExternal
                            color={useColorModeValue('blue.600', 'blue.200')}
                            href={task.target}
                            maxWidth="100%"
                            textOverflow="ellipsis"
                            overflow="hidden"
                        >
                            {task.target}
                        </Link>
                        <Tooltip
                            label={task.prompt}
                            aria-label="Task prompt"
                            openDelay={900}
                        >
                            <Text
                                fontSize="sm"
                                maxWidth="100%"
                                textOverflow="ellipsis"
                                overflow="hidden"
                            >
                                {task.prompt}
                            </Text>
                        </Tooltip>
                    </Flex>
                    {isEditable && (
                        <Flex
                            w="2rem"
                            h="100%"
                            align="center"
                            justify="center"
                            p={1}
                        >
                            <Button
                                size="sm"
                                aria-label="Delete task"
                                isDisabled={
                                    !user?.scopes.includes(UserScopes.EDIT)
                                }
                                isLoading={isDeleting}
                                bg={useColorModeValue('gray.300', 'gray.600')}
                                color={useColorModeValue(
                                    'gray.800',
                                    'gray.200'
                                )}
                                _hover={{
                                    bg: useColorModeValue('red.300', 'red.600'),
                                }}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    if (isEditable && onDelete) {
                                        onDelete(task)
                                    }
                                }}
                                disabled={!isEditable}
                            >
                                <Icon as={IoTrash} />
                            </Button>
                        </Flex>
                    )}
                </Flex>
            </Button>
        </SlideFade>
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
                {...props}
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
                {...props}
            />
        )
    } else {
        return (
            <Icon
                as={IoCloseCircle}
                color={useColorModeValue('red.500', 'red.300')}
                {...props}
            />
        )
    }
}
