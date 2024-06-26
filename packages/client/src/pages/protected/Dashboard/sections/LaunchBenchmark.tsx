import {
    Flex,
    FormControl,
    FormLabel,
    Button,
    Select,
    Heading,
} from '@chakra-ui/react'
import { useState } from 'preact/hooks'
import { MdRocketLaunch } from 'react-icons/md'

import BentoBox from '../BentoBox'
import { UserScopes } from '@domain/user.types'

const Benchmarks = [
    {
        name: 'VisualWebArena',
        url: 'https://jykoh.com/vwa',
    },
]

export default function LaunchBenchmark(): JSX.Element {
    const [benchmark, selectBenchmark] = useState<string>('')

    return (
        <BentoBox
            h="50%"
            gap={5}
            p={3}
            justifyContent="space-between"
            scope={UserScopes.EDIT}
        >
            <Flex direction="column" gap={3} h="100%">
                <Flex>
                    <Heading size="md">Launch Benchmark</Heading>
                </Flex>
                <Flex
                    direction="column"
                    gap={3}
                    justify="space-between"
                    h="100%"
                >
                    <Flex direction="column" gap={3} justify="center">
                        <FormControl isRequired={true}>
                            <FormLabel>Benchmark</FormLabel>
                            <Select
                                placeholder="Select dataset"
                                onChange={(e) =>
                                    selectBenchmark(e.target.value)
                                }
                                value={benchmark}
                            >
                                {Benchmarks.map((bench) => (
                                    <option key={bench.name} value={bench.url}>
                                        {bench.name}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                    </Flex>
                    <Button
                        leftIcon={<MdRocketLaunch />}
                        colorScheme="blue"
                        isDisabled={!benchmark}
                    >
                        Launch
                    </Button>
                </Flex>
            </Flex>
        </BentoBox>
    )
}
