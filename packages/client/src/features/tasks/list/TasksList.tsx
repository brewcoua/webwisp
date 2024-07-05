import { useEffect, useState } from 'preact/hooks'
import { Flex, Spinner, Text, useToast } from '@chakra-ui/react'

import { TaskProps } from '@domain/task.types'
import BentoBox from '@features/ui/BentoBox'
import { useAppDispatch } from '@store/hooks'

import TaskItem from './TaskItem'
import {
    deleteTask,
    fetchTasks,
    subscribeToTasks,
    useTasks,
} from '../tasks.slice'
import { selectTask } from '../selected.slice'

export default function TasksList() {
    const [isDeleting, setIsDeleting] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const toast = useToast()

    const tasks = useTasks()
    const dispatch = useAppDispatch()

    const onTaskSelect = (task: TaskProps) => {
        dispatch(selectTask(task))
    }

    const onTaskDelete = async (task: TaskProps) => {
        setIsDeleting(task.id)

        const result = await dispatch(deleteTask(task.id))
        if (result) {
            toast({
                title: 'Task deleted',
                description: `Task ${task.id} has been deleted`,
                status: 'success',
                duration: 9000,
                isClosable: true,
            })
        } else {
            toast({
                title: 'Failed to delete task',
                description: `Task ${task.id} could not be deleted`,
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        }

        setIsDeleting(null)
    }

    useEffect(() => {
        const load = async () => {
            if (await dispatch(fetchTasks())) {
                await dispatch(subscribeToTasks())
            }
        }
        setIsLoading(true)
        load().finally(() => setIsLoading(false))
    }, [])

    return (
        <BentoBox
            h="100%"
            w="20%"
            minW="15rem"
            position="relative"
            overflow="hidden"
        >
            {!isLoading && tasks.values.length > 0 && (
                <Flex
                    position="absolute"
                    top={0}
                    bottom={0}
                    left={0}
                    right={0}
                    p={2}
                    overflowY="auto"
                    direction="column"
                    gap={2}
                >
                    {tasks.values.map((task) => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            w="100%"
                            onTaskClick={onTaskSelect}
                            onDelete={onTaskDelete}
                            isDeleting={isDeleting === task.id}
                        />
                    ))}
                </Flex>
            )}
            {!isLoading && tasks.values.length === 0 && (
                <Flex h="100%" w="100%" align="center" justify="center">
                    <Text fontSize="lg">No tasks found</Text>
                </Flex>
            )}
            {isLoading && (
                <Flex h="100%" w="100%" align="center" justify="center">
                    <Spinner size="lg" />
                </Flex>
            )}
        </BentoBox>
    )
}
