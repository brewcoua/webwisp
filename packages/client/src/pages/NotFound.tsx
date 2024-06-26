import { Flex, Heading, Text } from '@chakra-ui/react'

export default function NotFound() {
    return (
        <Flex justify="center" align="center" w="100%" h="100%" gap={5}>
            <Heading size="lg" fontWeight="bold" borderRight="1px solid" pr={5}>
                404
            </Heading>
            <Text size="md">Page not found</Text>
        </Flex>
    )
}
