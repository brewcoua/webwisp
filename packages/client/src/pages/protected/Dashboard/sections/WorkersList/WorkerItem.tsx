import {
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    Flex,
    SlideFade,
    Text,
    useColorModeValue,
} from '@chakra-ui/react'

import { WorkerProps } from '@domain/worker.types'

import StatusIndicator from './StatusIndicator'
import TaskDisplay from './TaskDisplay'

export interface WorkerItemProps {
    worker: WorkerProps
    isSelected: boolean
}
export function WorkerItem({
    worker,
    isSelected,
}: WorkerItemProps): JSX.Element {
    return (
        <SlideFade in offsetY="20px">
            <AccordionItem
                border="none"
                mt={2}
                isDisabled={!worker.task}
                id={worker.id}
            >
                <AccordionButton
                    bg={useColorModeValue('gray.200', 'gray.600')}
                    borderRadius="lg"
                    opacity={0.85}
                    transition="border-radius 0.2s"
                    _hover={{
                        opacity: 1,
                    }}
                    _expanded={{
                        borderBottomRadius: worker.task ? 0 : 'lg',
                    }}
                    _disabled={{
                        opacity: 0.7,
                    }}
                    justifyContent="space-between"
                >
                    <Flex gap={3} alignItems="center">
                        <StatusIndicator status={worker.status} />
                        <Text>{worker.id}</Text>
                    </Flex>
                    {worker.task && <AccordionIcon />}
                </AccordionButton>
                {worker.task && isSelected && (
                    <TaskDisplay
                        task={worker.task}
                        bg={useColorModeValue('gray.300', 'gray.500')}
                        borderBottomRadius="lg"
                        p={3}
                    />
                )}
            </AccordionItem>
        </SlideFade>
    )
}
