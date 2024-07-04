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

import BentoBox from '@features/ui/BentoBox'
import { useAppDispatch } from '@store/hooks'

import TaskDetails from './TaskDetails'
import CyclesList from './CyclesList'
import Preview from './Preview'
import { queryTaskTrace, useSelectedTask } from '../selected.slice'

export default function TaskInfo() {
    const [isLoading, setIsLoading] = useState(false)

    const selectedTask = useSelectedTask()
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (selectedTask.id && !selectedTask.trace_url) {
            setIsLoading(true)
            dispatch(queryTaskTrace(selectedTask.id)).then(() =>
                setIsLoading(false)
            )
        }
    }, [selectedTask])

    return (
        <BentoBox direction="column" gap={5} h="100%" w="80%" p={3}>
            {(!selectedTask.id || isLoading) && (
                <Flex justify="center" align="center" h="100%" w="100%">
                    {!selectedTask.id && (
                        <Text>Select a task to view its details</Text>
                    )}
                    {isLoading && <Spinner size="lg" />}
                </Flex>
            )}
            {selectedTask.id && !isLoading && (
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
                            <TaskDetails task={selectedTask} />
                        </TabPanel>
                        <TabPanel h="100%">
                            <CyclesList cycles={selectedTask.cycles} />
                        </TabPanel>
                        <TabPanel h="100%">
                            <Preview trace={selectedTask.trace_url} />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            )}
        </BentoBox>
    )
}
