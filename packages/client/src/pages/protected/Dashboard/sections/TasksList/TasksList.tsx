import { useState } from 'preact/hooks'
import { useStore } from '@nanostores/preact'
import { Flex, Text, useToast } from '@chakra-ui/react'

import { useClient } from '@api/client'
import { $tasks, removeTask } from '@store/tasks'
import { TaskProps } from '@domain/task.types'

import BentoBox from '../../BentoBox'
import TaskItem from './TaskItem'
import { setSelectedTask } from '@store/selected_task'

export default function TasksList(): JSX.Element {
    const tasks = useStore($tasks)
    const [isDeleting, setIsDeleting] = useState<string | null>(null)
    const toast = useToast()

    const onTaskSelect = (task: TaskProps) => {
        setSelectedTask(task.id)
    }

    const onTaskDelete = async (task: TaskProps) => {
        try {
            setIsDeleting(task.id)
            await useClient().tasks.deleteTask(task.id)
            removeTask(task.id)
            setIsDeleting(null)
        } catch (err: any) {
            console.error(err)
            toast({
                title: 'Failed to delete task',
                description: err.message,
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
            setIsDeleting(null)
        }
    }

    return (
        <BentoBox
            h="100%"
            w="20%"
            minW="15rem"
            position="relative"
            overflow="hidden"
        >
            {tasks.length > 0 && (
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
                    {tasks.map((task) => (
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
            {tasks.length === 0 && (
                <Flex h="100%" w="100%" align="center" justify="center">
                    <Text fontSize="lg">No tasks found</Text>
                </Flex>
            )}
        </BentoBox>
    )
}
