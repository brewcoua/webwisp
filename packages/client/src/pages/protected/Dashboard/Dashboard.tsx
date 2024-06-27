import { Flex } from '@chakra-ui/react'

import LaunchTask from './sections/LaunchTask'
import LaunchBenchmark from './sections/LaunchBenchmark'
import WorkersList from './sections/WorkersList'
import TasksList from './sections/TasksList'
import BentoBox from './BentoBox'
import TaskInfo from './sections/TaskInfo'

export default function Dashboard(): JSX.Element {
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
                    <LaunchBenchmark />
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
                <TaskInfo />
            </Flex>
        </Flex>
    )
}
