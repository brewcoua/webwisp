import { Flex, FlexProps, Heading, useColorModeValue } from '@chakra-ui/react'
import { UserScopes } from '@domain/user.types'
import { useUser } from '@features/users/user.slice'

export interface BentoBoxProps extends FlexProps, BentoBoxContentProps {
    scope?: UserScopes
    header?: string
}

export default function BentoBox({
    scope,
    h,
    w,
    minW,
    minH,
    ...props
}: BentoBoxProps) {
    const user = useUser()

    const isUnauthorized = scope && !user?.scopes.includes(scope)

    return (
        <Flex
            direction="column"
            gap={3}
            position="relative"
            h={h}
            w={w}
            minW={minW}
            minH={minH}
            overflow="hidden"
            boxShadow="md"
            borderRadius="2xl"
            border="1px solid"
            borderColor={useColorModeValue('gray.200', 'gray.700')}
        >
            {isUnauthorized && (
                <Flex
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bg={useColorModeValue('whiteAlpha.700', 'blackAlpha.700')}
                    backdropFilter="blur(5px)"
                    borderRadius="2xl"
                    justify="center"
                    align="center"
                    zIndex={1}
                >
                    <Heading size="lg">Unauthorized</Heading>
                </Flex>
            )}
            <BentoBoxContent {...props}>{props.children}</BentoBoxContent>
        </Flex>
    )
}

export interface BentoBoxContentProps extends FlexProps {}
export function BentoBoxContent(props: BentoBoxContentProps) {
    return (
        <Flex
            bg={useColorModeValue('gray.50', 'gray.900')}
            borderRadius="2xl"
            direction="column"
            h="full"
            w="full"
            {...props}
        >
            {props.children}
        </Flex>
    )
}
