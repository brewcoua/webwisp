import {
    BoxProps,
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
    useToast,
} from '@chakra-ui/react'
import { useStore } from '@nanostores/preact'
import { $user } from '@store/user'
import { useState } from 'preact/hooks'

import { TaskProps, TaskStatus } from '@domain/task.types'

import { MdOutlinePending } from 'react-icons/md'
import { IoCheckmarkCircle, IoCloseCircle, IoTrash } from 'react-icons/io5'

import { selectedTask } from './TasksList'
import { UserScopes } from '@domain/user.types'
import { useClient } from '@api/client'
import { removeTask } from '@store/tasks'

export interface TaskItemProps extends ButtonProps {
    task: TaskProps
}

export default function TaskItem({
    task,
    ...props
}: TaskItemProps): JSX.Element {
    const user = useStore($user)
    const toast = useToast()

    const [isDeleting, setIsDeleting] = useState(false)
    const onDelete = async () => {
        try {
            setIsDeleting(true)
            await useClient().tasks.deleteTask(task.id)
            removeTask(task.id)
            setIsDeleting(false)
        } catch (err: any) {
            console.error(err)
            toast({
                title: 'Failed to delete task',
                description: err.message,
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
            setIsDeleting(false)
        }
    }

    return (
        <SlideFade in offsetY="20px" style={{ width: '100%' }}>
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
                borderRadius="md"
                onClick={() => {
                    selectedTask.value = task.id
                }}
                isDisabled={isDeleting}
                px={1}
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
                        w="calc(100% - 4.5rem)"
                    >
                        <Link
                            fontSize="xs"
                            isExternal
                            color={useColorModeValue('blue.600', 'blue.200')}
                            href={task.target}
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
                    <Flex
                        w="2rem"
                        h="100%"
                        align="center"
                        justify="center"
                        p={1}
                    >
                        <IconButton
                            size="sm"
                            icon={<IoTrash />}
                            aria-label="Delete task"
                            isDisabled={!user?.scopes.includes(UserScopes.EDIT)}
                            isLoading={isDeleting}
                            onClick={(e) => {
                                e.stopPropagation()
                                onDelete()
                            }}
                        />
                    </Flex>
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
