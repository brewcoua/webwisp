import {
    Button,
    ButtonProps,
    Flex,
    Icon,
    Link,
    SlideFade,
    Text,
    Tooltip,
    useColorModeValue,
} from '@chakra-ui/react'

import { TaskProps, TaskStatus } from '@domain/task.types'

import { IoTrash } from 'react-icons/io5'

import { UserScopes } from '@domain/user.types'
import { useUser } from '@features/users/user.slice'
import { TaskStatusIcon } from './TaskStatusIcon'
import { useSelectedTask } from '../selected.slice'

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
}: TaskItemProps) {
    const user = useUser()
    const selectedTask = useSelectedTask()

    const isEditable =
        user?.scopes.includes(UserScopes.EDIT) &&
        [TaskStatus.COMPLETED, TaskStatus.FAILED].includes(task.status)

    return (
        <SlideFade in offsetY="20px" style={{ width: '100%' }}>
            <Button
                bg={useColorModeValue('gray.200', 'gray.600')}
                opacity={selectedTask?.id === task.id ? 1 : 0.7}
                _hover={{
                    opacity: selectedTask?.id === task.id ? 1 : 0.9,
                }}
                _active={{
                    bg: useColorModeValue('gray.200', 'gray.600'),
                    transform: 'scale(0.99)',
                }}
                transition="transform 0.05s"
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
                                onClick={(e: any) => {
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
