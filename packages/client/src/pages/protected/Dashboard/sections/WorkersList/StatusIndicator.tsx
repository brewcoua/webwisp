import {
    Box,
    BoxProps,
    Spinner,
    keyframes,
    useColorModeValue,
} from '@chakra-ui/react'
import { WorkerStatus } from '@domain/worker.types'

export interface StatusIndicatorProps extends BoxProps {
    status: WorkerStatus
}

export default function StatusIndicator({
    status,
    ...props
}: StatusIndicatorProps): JSX.Element {
    const baseProps: BoxProps = {
        h: '0.75rem',
        w: '0.75rem',
        borderRadius: 'full',
        mt: 0,
    }

    if (status === WorkerStatus.READY)
        return <ReadyIndicator {...baseProps} {...props} />
    else return <BusyIndicator {...baseProps} {...props} />
}

const pulseRing = keyframes`
    0% {
        transform: scale(0.33);
    }
    80%, 100% {
        opacity: 0;
    }
`

function ReadyIndicator(props: BoxProps) {
    return (
        <Box
            borderRadius="full"
            bg={useColorModeValue('green.500', 'green.300')}
            _before={{
                content: '""',
                position: 'relative',
                display: 'block',
                width: '300%',
                height: '300%',
                boxSizing: 'border-box',
                ml: '-100%',
                mt: '-100%',
                borderRadius: 'full',
                bg: useColorModeValue('green.500', 'green.300'),
                animation: `${pulseRing} 1.25s cubic-bezier(0.215, 0.61, 0.355, 1) infinite`,
            }}
            {...props}
        />
    )
}

function BusyIndicator(props: BoxProps) {
    return (
        <Box position="relative" {...props}>
            <Spinner
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                size="xs"
                color={useColorModeValue('blue.500', 'blue.300')}
            />
        </Box>
    )
}
