import { signal } from '@preact/signals'
import BentoBox from '../../BentoBox'
import TaskItem from './TaskItem'

import { useStore } from '@nanostores/preact'
import { $tasks } from '@store/tasks'

export const selectedTask = signal<string | null>(null)

export default function TasksList(): JSX.Element {
    const tasks = useStore($tasks)

    return (
        <BentoBox h="100%" w="30%" minW="20rem" direction="column" gap={2}>
            {tasks.map((task) => (
                <TaskItem key={task.id} task={task} />
            ))}
        </BentoBox>
    )
}
