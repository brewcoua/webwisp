import { Flex, FlexProps, Heading, useColorModeValue } from '@chakra-ui/react'

interface BentoBoxProps extends FlexProps {
  header?: string
  children: JSX.Element | JSX.Element[] | string
}

export default function BentoBox({ header, children, h, w, ...props }: BentoBoxProps): JSX.Element {
  if (header) {
    return (
      <Flex
        bg={useColorModeValue('gray.200', 'gray.700')}
        borderRadius="3xl"
        boxShadow="md"
        direction="column"
        p={4}
        gap={3}
        h={h}
        w={w}
      >
        <Heading size="md" mb={3}>
          {header}
        </Heading>
        <Flex direction="column" {...props} h="full">
          {children}
        </Flex>
      </Flex>
    )
  }

  return (
    <Flex
      bg={useColorModeValue('gray.200', 'gray.700')}
      borderRadius="3xl"
      boxShadow="md"
      direction="column"
      p={4}
      h={h}
      w={w}
      {...props}
    >
      {children}
    </Flex>
  )
}
