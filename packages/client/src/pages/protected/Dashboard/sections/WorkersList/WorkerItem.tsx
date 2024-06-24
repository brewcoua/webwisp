import {
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Flex,
    SlideFade,
    Text,
    useColorModeValue,
} from '@chakra-ui/react'

import Worker from '@domain/Worker'

import StatusIndicator from './StatusIndicator'
import TaskDescription from './TaskDescription'

export function WorkerItem({ worker }: { worker: Worker }): JSX.Element {
    return (
        <SlideFade in offsetY="20px">
            <AccordionItem border="none" mt={2}>
                <AccordionButton
                    bg={useColorModeValue('gray.200', 'gray.600')}
                    borderRadius="lg"
                    opacity={0.7}
                    transition="border-radius 0.2s"
                    _hover={{
                        opacity: 1,
                    }}
                    _expanded={{
                        borderBottomRadius: worker.task ? 0 : 'lg',
                    }}
                    disabled={!worker.task}
                    justifyContent="space-between"
                >
                    <Flex gap={3} alignItems="center">
                        <StatusIndicator status={worker.status} />
                        <Text>{worker.id}</Text>
                    </Flex>
                    {worker.task && <AccordionIcon />}
                </AccordionButton>
                {worker.task && (
                    <TaskDescription
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
