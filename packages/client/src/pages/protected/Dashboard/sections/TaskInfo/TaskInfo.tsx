import { useStore } from '@nanostores/preact'
import { $tasks } from '@store/tasks'

import BentoBox from '../../BentoBox'
import { selectedTask } from '../TasksList/TasksList'
import Preview from './Preview'
import { Flex } from '@chakra-ui/react'
import CyclesList from './CyclesList'

export default function TaskInfo(): JSX.Element {
    const task = useStore($tasks).find((task) => task.id === selectedTask.value)

    return (
        <BentoBox direction="column" gap={5} h="100%" w="70%" p={3}>
            {!task && (
                <Flex justify="center" align="center" h="100%" w="100%">
                    Select a task to view its details
                </Flex>
            )}
            {task && (
                <>
                    <Preview task_id={task.id} />
                    <CyclesList cycles={task.cycles} />
                </>
            )}
        </BentoBox>
    )
}
