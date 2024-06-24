import { Flex, FormControl, FormLabel, Button, Select } from '@chakra-ui/react'
import { useState } from 'preact/hooks'
import { MdRocketLaunch } from 'react-icons/md'

import BentoBox from '../BentoBox'

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
            justifyContent="space-between"
            header="Launch Benchmark"
        >
            <Flex direction="column" gap={3}>
                <FormControl isRequired={true}>
                    <FormLabel>Benchmark</FormLabel>
                    <Select
                        placeholder="Select dataset"
                        onChange={(e) => selectBenchmark(e.target.value)}
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
        </BentoBox>
    )
}
