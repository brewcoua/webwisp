import { Flex } from '@chakra-ui/react'
import BentoBox from './BentoBox'
import NewRunner from './parts/NewRunner'
import LaunchDataset from './parts/LaunchDataset'

export default function Dashboard(): JSX.Element {
  return (
    <Flex
      p={{
        base: 3,
        sm: 5,
        md: 10,
        lg: 20
      }}
      h="100%"
      w="100%"
      gap={5}
      alignItems="center"
      justifyContent="center"
    >
      <BentoBox h="100%" w="50%">
        Lorem ipsum
      </BentoBox>
      <Flex direction="column" gap={5} h="100%" w="50%">
        <NewRunner />
        <LaunchDataset />
      </Flex>
    </Flex>
  )
}
