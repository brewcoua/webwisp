import BentoBox from '@features/ui/BentoBox'
import { Flex, Text } from '@chakra-ui/react'

import { useSelectedDisplay } from '../selected.slice'
import TaskDisplay from './TaskDisplay'
import GroupDisplay from './GroupDisplay'

export default function InfoDisplay() {
    const display = useSelectedDisplay()

    return (
        <BentoBox direction="column" gap={5} h="100%" w="80%" p={3}>
            {!display && (
                <Flex justify="center" align="center" h="100%" w="100%">
                    <Text>Select a task to view its details</Text>
                </Flex>
            )}
            {display && (
                <>
                    {display === 'task' && <TaskDisplay />}
                    {display === 'group' && <GroupDisplay />}
                </>
            )}
        </BentoBox>
    )
}
