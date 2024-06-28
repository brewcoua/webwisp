import { useStore } from '@nanostores/preact'
import { $tasks } from '@store/tasks'
import {
    Flex,
    Spinner,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
} from '@chakra-ui/react'
import { useEffect, useState } from 'preact/hooks'

import BentoBox from '../../BentoBox'
import { selectedTask } from '../TasksList/TasksList'
import Preview from './Preview'

import CyclesList from './CyclesList'
import { TaskProps } from '@domain/task.types'
import { useClient } from '@api/client'
import TaskDetails from './TaskDetails'

export default function TaskInfo(): JSX.Element {
    const [isLoading, setIsLoading] = useState(false)

    const [task, setTask] = useState<TaskProps | null>(null)
    const [trace, setTrace] = useState<string | null>(null)

    const tasks = useStore($tasks)

    useEffect(() => {
        selectedTask.subscribe((val) => {
            if (!val) {
                setTask(null)
            }

            const foundTask = tasks.find((task) => task.id === val)
            if (foundTask) {
                setTask(foundTask)
                setIsLoading(true)
                useClient()
                    .tasks.getTrace(foundTask.id)
                    .then((trace) => {
                        setTrace(trace)
                        setIsLoading(false)
                    })
            }
        })
    }, [])

    return (
        <BentoBox direction="column" gap={5} h="100%" w="80%" p={3}>
            {(!task || isLoading) && (
                <Flex justify="center" align="center" h="100%" w="100%">
                    {!task && <Text>Select a task to view its details</Text>}
                    {isLoading && <Spinner size="lg" />}
                </Flex>
            )}
            {task && !isLoading && (
                <Tabs
                    h="100%"
                    defaultIndex={0}
                    display="flex"
                    flexDir="column"
                    justifyContent="stretch"
                    alignItems="flex-start"
                >
                    <TabList>
                        <Tab>Details</Tab>
                        <Tab>Cycles</Tab>
                        <Tab>Preview</Tab>
                    </TabList>
                    <TabPanels h="100%">
                        <TabPanel h="100%">
                            <TaskDetails task={task} />
                        </TabPanel>
                        <TabPanel h="100%">
                            <CyclesList cycles={task.cycles} />
                        </TabPanel>
                        <TabPanel h="100%">
                            <Preview trace={trace} />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            )}
        </BentoBox>
    )
}
