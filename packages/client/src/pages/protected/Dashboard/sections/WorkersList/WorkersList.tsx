import { useStore } from '@nanostores/preact'
import { Accordion, SlideFade, Text } from '@chakra-ui/react'

import { $workers } from '@store/workers'
import { useClient } from '@api/client'
import { useEffect, useState } from 'preact/hooks'

import BentoBox from '../../BentoBox'
import { WorkerItem } from './WorkerItem'

import styles from './WorkersList.module.scss'

export default function WorkersList(): JSX.Element {
    useEffect(() => {
        useClient()
            .workers.getWorkers()
            .then((workers) => {
                $workers.set(workers)
            })
    }, [])

    const workers = useStore($workers)

    return (
        <BentoBox h="100%" w="50%" position="relative" overflow="hidden">
            {workers.length > 0 && (
                <Accordion
                    position="absolute"
                    top="0"
                    left="0"
                    bottom="0"
                    right="0"
                    overflowY="auto"
                    className={styles.workersList}
                    allowToggle
                    p={2}
                >
                    {workers.map((worker) => (
                        <WorkerItem worker={worker} key={worker.id} />
                    ))}
                </Accordion>
            )}
            {workers.length === 0 && (
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
        </BentoBox>
    )
}
