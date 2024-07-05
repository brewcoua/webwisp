import { Flex } from '@chakra-ui/react'

import InfoDisplay from '@features/tasks/info'
import { LaunchScenario, LaunchTask } from '@features/tasks/launch'
import TasksList from '@features/tasks/list'

import WorkersList from '@features/workers/list'

export default function Dashboard() {
    return (
        <Flex
            h="200%"
            w="100%"
            direction="column"
            gap={5}
            p={{
                base: 2,
                sm: 3,
                md: 4,
                lg: 5,
            }}
        >
            <Flex
                pb={0}
                direction="row"
                gap={5}
                h="50%"
                w="100%"
                alignItems="center"
                justifyContent="center"
            >
                <WorkersList />
                <Flex direction="column" gap={5} h="100%" w="50%">
                    <LaunchTask />
                    <LaunchScenario />
                </Flex>
            </Flex>
            <Flex
                pt={0}
                direction="row"
                gap={5}
                h="50%"
                w="100%"
                alignItems="center"
                justifyContent="center"
            >
                <TasksList />
                <InfoDisplay />
            </Flex>
        </Flex>
    )
}
