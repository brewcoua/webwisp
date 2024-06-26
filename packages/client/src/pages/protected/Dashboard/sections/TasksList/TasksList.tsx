import { signal } from '@preact/signals'
import BentoBox from '../../BentoBox'
import TaskItem from './TaskItem'

import { useStore } from '@nanostores/preact'
import { $tasks } from '@store/tasks'
import { Flex, Text } from '@chakra-ui/react'

export const selectedTask = signal<string | null>(null)

export default function TasksList(): JSX.Element {
    const tasks = useStore($tasks)

    return (
        <BentoBox
            h="100%"
            w="30%"
            minW="20rem"
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
                    overflowY="auto"
                    p={3}
                    direction="column"
                    gap={2}
                >
                    {tasks.map((task) => (
                        <TaskItem key={task.id} task={task} w="100%" />
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
