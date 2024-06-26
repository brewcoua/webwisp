import { useStore } from '@nanostores/preact'
import { $tasks } from '@store/tasks'
import { Flex } from '@chakra-ui/react'

import BentoBox from '../../BentoBox'
import { selectedTask } from '../TasksList/TasksList'
import Preview from './Preview'

export default function TaskInfo(): JSX.Element {
    const task = useStore($tasks).find((task) => task.id === selectedTask.value)

    return (
        <BentoBox direction="column" gap={5} h="100%" w="70%">
            <Preview task_id={task?.id ?? ''} />
        </BentoBox>
    )
}
