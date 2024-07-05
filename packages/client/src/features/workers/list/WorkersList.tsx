import { Accordion, Flex, SlideFade, Spinner, Text } from '@chakra-ui/react'

import { useEffect, useState } from 'preact/hooks'

import BentoBox from '@features/ui/BentoBox'
import { useAppDispatch } from '@store/hooks'

import { WorkerItem } from './WorkerItem'
import { fetchWorkers, subscribeToWorkers, useWorkers } from '../workers.slice'

export default function WorkersList() {
    const workers = useWorkers()
    const dispatch = useAppDispatch()

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const load = async () => {
            if (await dispatch(fetchWorkers())) {
                await dispatch(subscribeToWorkers())
            }
        }

        setIsLoading(true)
        load().finally(() => setIsLoading(false))
    }, [])

    return (
        <BentoBox h="100%" w="50%" position="relative" overflow="hidden">
            {!isLoading && workers.length > 0 && (
                <Accordion
                    position="absolute"
                    top="0"
                    left="0"
                    bottom="0"
                    right="0"
                    overflowY="auto"
                    allowToggle
                    p={2}
                >
                    {workers.map((worker) => (
                        <WorkerItem worker={worker} key={worker.id} />
                    ))}
                </Accordion>
            )}
            {!isLoading && workers.length === 0 && (
                <SlideFade
                    in
                    offsetY="20px"
                    style={{ width: '100%', height: '100%' }}
                >
                    <Text
                        position="absolute"
                        top="50%"
                        left="50%"
                        transform="translate(-50%, -50%)"
                    >
                        No workers available
                    </Text>
                </SlideFade>
            )}
            {isLoading && (
                <Flex justify="center" align="center" h="100%" w="100%">
                    <Spinner size="lg" />
                </Flex>
            )}
        </BentoBox>
    )
}
