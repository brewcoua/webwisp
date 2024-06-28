import { Flex, Spinner, Text, useColorModeValue } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'preact/hooks'

export interface PreviewProps {
    trace: string | null
}

export default function Preview({ trace }: PreviewProps): JSX.Element {
    if (!trace) {
        return (
            <Flex
                h="100%"
                w="100%"
                align="center"
                justify="center"
                bg={useColorModeValue('gray.100', 'gray.800')}
            >
                <Text>No trace found</Text>
            </Flex>
        )
    }

    const [isLoading, setIsLoading] = useState(true)
    const frameRef = useRef<HTMLIFrameElement>(null)

    useEffect(() => {
        if (!frameRef.current) {
            return
        }

        setIsLoading(true)
        frameRef.current.src = trace

        const onLoad = async () => {
            const iframeDocument =
                frameRef.current?.contentDocument ||
                frameRef.current?.contentWindow?.document
            const style = iframeDocument?.createElement('style')
            style!.textContent = `
                .header {
                    display: none !important;
                }
            `
            iframeDocument?.head.appendChild(style!)
            setIsLoading(false)
        }

        frameRef.current.addEventListener('load', onLoad)

        return () => {
            frameRef.current?.removeEventListener('load', onLoad)
            setIsLoading(true)
        }
    }, [trace])

    return (
        <Flex
            w="100%"
            h="100%"
            direction="column"
            position="relative"
            borderRadius="3xl"
            overflow="hidden"
            border="2px solid"
            borderColor={useColorModeValue('gray.300', 'gray.700')}
            boxShadow="lg"
        >
            {isLoading && (
                <Flex
                    h="100%"
                    w="100%"
                    align="center"
                    justify="center"
                    bg={useColorModeValue('gray.100', 'gray.800')}
                    position="absolute"
                    zIndex="1"
                    top="0"
                    left="0"
                >
                    <Spinner size="xl" />
                </Flex>
            )}
            <iframe
                ref={frameRef}
                style={{
                    width: '100%',
                    height: '100%',
                }}
            />
        </Flex>
    )
}
