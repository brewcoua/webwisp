import { Box, Flex, FlexProps, Link, Spinner, Text, useColorModeValue } from '@chakra-ui/react'

import { FaHourglassHalf } from 'react-icons/fa'
import { IoIosCheckmarkCircle, IoIosCloseCircle } from 'react-icons/io'

import RunnerProps from '@common/RunnerProps'
import type { RunnerStatus } from '@webwisp/lib'

export interface RunnerItemProps extends FlexProps {
  runner: RunnerProps
}

export default function RunnerItem({ runner, ...props }: RunnerItemProps): JSX.Element {
  const StatusIcons = {
    starting: (
      <Box color={useColorModeValue('gray.500', 'gray.400')}>
        <FaHourglassHalf />
      </Box>
    ),
    running: <Spinner size="sm" color={useColorModeValue('blue.500', 'blue.400')} />,
    done: (
      <Box color={useColorModeValue('green.500', 'green.400')}>
        <IoIosCheckmarkCircle />
      </Box>
    ),
    failed: (
      <Box color={useColorModeValue('red.500', 'red.400')}>
        <IoIosCloseCircle />
      </Box>
    )
  } satisfies Record<RunnerStatus, JSX.Element>

  return (
    <Link
      href={`/run/${runner.id}`}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
      <Flex
        align="center"
        p={3}
        role="group"
        cursor="pointer"
        _hover={{
          bg: useColorModeValue('gray.200', 'gray.700'),
          color: useColorModeValue('gray.900', 'gray.200')
        }}
        transition=".05s"
        fontSize="sm"
        {...props}
      >
        {StatusIcons[runner.status]}
        <Text ml={2}>Runner {runner.id}</Text>
      </Flex>
    </Link>
  )
}
