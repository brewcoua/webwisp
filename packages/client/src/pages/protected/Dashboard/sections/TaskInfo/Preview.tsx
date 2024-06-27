import { useClient } from '@api/client'
import { Flex, Spinner, Text, useColorModeValue } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'preact/hooks'

export interface PreviewProps {
    task_id: string | null
}

export default function Preview({ task_id }: PreviewProps): JSX.Element {
    if (!task_id) {
        return (
            <Flex
                h="100%"
                w="100%"
                align="center"
                justify="center"
                bg={useColorModeValue('gray.100', 'gray.800')}
            >
                <Text>No task selected</Text>
            </Flex>
        )
    }

    const [isLoading, setIsLoading] = useState(true)
    const [isNotFound, setIsNotFound] = useState(false)
    const frameRef = useRef<HTMLIFrameElement>(null)

    useEffect(() => {
        if (!frameRef.current) {
            return
        }

        setIsLoading(true)
        setIsNotFound(false)
        useClient()
            .tasks.getTrace(task_id)
            .then((url) => {
                if (!url) {
                    setIsNotFound(true)
                } else if (frameRef.current) {
                    frameRef.current.src = url
                }
            })

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
    }, [task_id])

    return (
        <Flex
            w="100%"
            h="100%"
            direction="column"
            position="relative"
            borderRadius="lg"
        >
            {(isLoading || isNotFound) && (
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
                    borderRadius="3xl"
                >
                    {isLoading && <Spinner size="xl" />}
                    {!isLoading && isNotFound && <Text>Trace not found</Text>}
                </Flex>
            )}
            {!isNotFound && (
                <iframe
                    ref={frameRef}
                    style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '1.5rem',
                    }}
                />
            )}
        </Flex>
    )
}
