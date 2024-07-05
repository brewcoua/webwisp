import { Button, SlideFade, useColorModeValue } from '@chakra-ui/react'
import { CgDetailsMore } from 'react-icons/cg'

import { setDisplay, useSelectedDisplay } from '../selected.slice'
import { useAppDispatch } from '@store/hooks'

export default function GroupButton() {
    const display = useSelectedDisplay()
    const dispatch = useAppDispatch()

    const isGroupDisplay = display === 'group'

    return (
        <SlideFade in offsetY="20px" style={{ width: '100%' }}>
            <Button
                bg={useColorModeValue('gray.200', 'gray.600')}
                opacity={isGroupDisplay ? 1 : 0.7}
                _hover={{
                    opacity: isGroupDisplay ? 1 : 0.9,
                }}
                _active={{
                    bg: useColorModeValue('gray.200', 'gray.600'),
                    transform: 'scale(0.99)',
                }}
                transition="transform 0.05s"
                display="flex"
                align="center"
                justify="center"
                borderRadius="md"
                onClick={() => {
                    dispatch(setDisplay(isGroupDisplay ? 'task' : 'group'))
                }}
                w="100%"
                leftIcon={<CgDetailsMore />}
                size="sm"
            >
                Group Details
            </Button>
        </SlideFade>
    )
}
