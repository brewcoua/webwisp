import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Code,
    Flex,
    Icon,
    IconProps,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useColorModeValue,
} from '@chakra-ui/react'
import { useMemo } from 'preact/hooks'

import { HiOutlineCursorClick } from 'react-icons/hi'
import { FaKeyboard, FaMousePointer } from 'react-icons/fa'
import { PiKeyReturnBold, PiMouseScroll } from 'react-icons/pi'
import {
    IoArrowBackCircle,
    IoArrowForwardCircle,
    IoCheckmarkDoneCircle,
    IoCheckmarkCircle,
    IoCloseCircle,
} from 'react-icons/io5'
import { MdOutlinePending } from 'react-icons/md'
import { GrSelect } from 'react-icons/gr'

import { ActionStatus, ActionType } from '@domain/action.types'
import { CycleReport } from '@domain/task.types'

export interface CyclesListProps {
    cycles: CycleReport[]
}

export default function CyclesList({ cycles }: CyclesListProps) {
    return (
        <Flex position="relative" h="100%" w="100%" overflow="hidden">
            <Flex
                position="absolute"
                top={0}
                bottom={0}
                left={0}
                right={0}
                overflowY="auto"
                px={1}
            >
                {cycles.length === 0 && (
                    <Text>No cycles to display for this task</Text>
                )}
                {cycles.length > 0 && (
                    <Accordion
                        allowToggle
                        w="100%"
                        gap={1}
                        display="flex"
                        flexDir="column"
                    >
                        {cycles.map((cycle, index) => (
                            <CycleDisplay
                                key={index}
                                index={index}
                                cycle={cycle}
                            />
                        ))}
                    </Accordion>
                )}
            </Flex>
        </Flex>
    )
}

export interface CycleDisplayProps {
    index: number
    cycle: CycleReport
}
export function CycleDisplay({ index, cycle }: CycleDisplayProps) {
    const actionsCommands = useMemo(() => {
        return cycle.actions.map((action) => {
            const base = action.type
            const args = Object.values(action.arguments || {}).map((arg) => {
                if (typeof arg === 'string') return `"${arg}"`
                return arg
            })

            if (args) return `${base} ${args.join(' ')}`
            return base
        })
    }, [cycle.actions])

    return (
        <AccordionItem border="none">
            <h2>
                <AccordionButton
                    alignItems="center"
                    justifyContent="space-between"
                    bg={useColorModeValue('gray.200', 'gray.600')}
                    _hover={{ bg: useColorModeValue('gray.300', 'gray.500') }}
                    borderRadius="md"
                >
                    <Flex align="center" justify="flex-start" gap={2}>
                        <Text>{`${index + 1}. ${cycle.description}`}</Text>
                    </Flex>
                    <Flex align="center" gap={1}>
                        <Text
                            fontStyle="italic"
                            color={useColorModeValue('gray.600', 'gray.300')}
                        >
                            {cycle.duration}ms
                        </Text>
                        <AccordionIcon />
                    </Flex>
                </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
                <Text>{cycle.reasoning || 'No reasoning given.'}</Text>
                <TableContainer
                    mt={2}
                    border="1px solid"
                    borderColor="gray.300"
                    borderRadius="md"
                >
                    <Table variant="striped" colorScheme="gray">
                        <Thead>
                            <Tr>
                                <Th>Type</Th>
                                <Th>Command</Th>
                                <Th>Status</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {cycle.actions.map((action, index) => (
                                <Tr key={index}>
                                    <Td>
                                        <ActionIcon type={action.type} />
                                    </Td>
                                    <Td>
                                        <Code
                                            bg={useColorModeValue(
                                                'gray.200',
                                                'gray.700'
                                            )}
                                        >
                                            {actionsCommands[index]}
                                        </Code>
                                    </Td>
                                    <Td>
                                        <StatusIcon status={action.status} />
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </AccordionPanel>
        </AccordionItem>
    )
}

export interface ActionIconProps extends IconProps {
    type: ActionType
}

const actionIcons = {
    [ActionType.CLICK]: HiOutlineCursorClick,
    [ActionType.TYPE]: FaKeyboard,
    [ActionType.HOVER]: FaMousePointer,
    [ActionType.SELECT]: GrSelect,
    [ActionType.PRESS_ENTER]: PiKeyReturnBold,
    [ActionType.SCROLL]: PiMouseScroll,
    [ActionType.BACK]: IoArrowBackCircle,
    [ActionType.FORWARD]: IoArrowForwardCircle,
    [ActionType.DONE]: IoCheckmarkDoneCircle,
}
export function ActionIcon({ type, ...props }: ActionIconProps) {
    const IconKind = actionIcons[type]
    return <Icon as={IconKind} {...props} />
}

export interface StatusIconProps extends IconProps {
    status: ActionStatus
}

const statusColors = {
    [ActionStatus.COMPLETED]: 'green.500',
    [ActionStatus.FAILED]: 'red.500',
    [ActionStatus.PENDING]: 'gray.500',
}

const statusIcons = {
    [ActionStatus.COMPLETED]: IoCheckmarkCircle,
    [ActionStatus.FAILED]: IoCloseCircle,
    [ActionStatus.PENDING]: MdOutlinePending,
}

export function StatusIcon({ status, ...props }: StatusIconProps) {
    return (
        <Icon
            color={statusColors[status]}
            as={statusIcons[status]}
            {...props}
        />
    )
}
