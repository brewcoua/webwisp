import { Flex } from '@chakra-ui/react'

import LaunchTask from './sections/LaunchTask'
import LaunchBenchmark from './sections/LaunchBenchmark'
import WorkersList from './sections/WorkersList'

export default function Dashboard(): JSX.Element {
    return (
        <Flex
            p={{
                base: 3,
                sm: 5,
                md: 10,
                lg: 20,
            }}
            h="100%"
            w="100%"
            gap={5}
            alignItems="center"
            justifyContent="center"
        >
            <WorkersList />
            <Flex direction="column" gap={5} h="100%" w="50%">
                <LaunchTask />
                <LaunchBenchmark />
            </Flex>
        </Flex>
    )
}
