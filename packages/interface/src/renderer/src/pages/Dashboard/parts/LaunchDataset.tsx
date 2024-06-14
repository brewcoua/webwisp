import { Flex, FormControl, FormLabel, Button, Select } from '@chakra-ui/react'
import { useState } from 'preact/hooks'
import { MdRocketLaunch } from 'react-icons/md'

import BentoBox from '../BentoBox'

const Datasets = [
  {
    name: 'VisualWebArena',
    url: 'https://jykoh.com/vwa'
  }
]

export default function LaunchDataset(): JSX.Element {
  const [dataset, setDataset] = useState<string>('')

  return (
    <BentoBox h="50%" gap={5} justifyContent="space-between" header="Launch Dataset Evaluation">
      <Flex direction="column" gap={3}>
        <FormControl isRequired={true}>
          <FormLabel>Dataset</FormLabel>
          <Select
            placeholder="Select dataset"
            onChange={(e) => setDataset(e.target.value)}
            value={dataset}
          >
            {Datasets.map((d) => (
              <option key={d.name} value={d.url}>
                {d.name}
              </option>
            ))}
          </Select>
        </FormControl>
      </Flex>
      <Button leftIcon={<MdRocketLaunch />} colorScheme="blue" isDisabled={!dataset}>
        Launch
      </Button>
    </BentoBox>
  )
}
