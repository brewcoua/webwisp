import {
  Box,
  BoxProps,
  CloseButton,
  Divider,
  Flex,
  IconButton,
  Text,
  useColorMode,
  useColorModeValue
} from '@chakra-ui/react'
import { FiHome } from 'react-icons/fi'
import { FaSun, FaMoon } from 'react-icons/fa'

import NavItem from './NavItem'
import { useRunners } from '@renderer/state/Runners'
import RunnerItem from './RunnerItem'

export interface SidebarProps extends BoxProps {
  onClose: () => void
}

export default function SidebarContent({ onClose, ...props }: SidebarProps): JSX.Element {
  const runners = useRunners()

  return (
    <Box
      bg={useColorModeValue('white', 'gray.800')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.100', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...props}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          WebWisp
        </Text>
        <IconButton
          icon={useColorModeValue(<FaSun />, <FaMoon />)}
          onClick={() => useColorMode().toggleColorMode()}
          aria-label="Toggle color mode"
        />
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      <NavItem icon={FiHome} href="/">
        Dashboard
      </NavItem>
      <Divider my="4" />
      <Box position="relative" h="full">
        <Flex
          position="absolute"
          top={0}
          left={0}
          right={0}
          direction="column"
          overflowY="auto"
          h="full"
        >
          {runners.map((runner) => (
            <RunnerItem key={runner.id} runner={runner} />
          ))}
          {runners.length === 0 && (
            <Text textAlign="center" my="4" color="gray.500">
              No runners
            </Text>
          )}
        </Flex>
      </Box>
    </Box>
  )
}
