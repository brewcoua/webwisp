import { Flex } from '@chakra-ui/react'

import LaunchTask from './sections/LaunchTask'
import LaunchBenchmark from './sections/LaunchBenchmark'
import WorkersList from './sections/WorkersList'
import TasksList from './sections/TasksList'
import BentoBox from './BentoBox'

export default function Dashboard(): JSX.Element {
    return (
        <Flex h="200%" w="100%" direction="column">
            <Flex
                p={{
                    base: 3,
                    sm: 5,
                    md: 10,
                    lg: 20,
                }}
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
                p={{
                    base: 3,
                    sm: 5,
                    md: 10,
                    lg: 20,
                }}
                pt={0}
                direction="row"
                gap={5}
                h="50%"
                w="100%"
                alignItems="center"
                justifyContent="center"
            >
                <TasksList />
                <BentoBox direction="column" gap={5} h="100%" w="70%">
                    TODO
                </BentoBox>
            </Flex>
        </Flex>
    )
}
