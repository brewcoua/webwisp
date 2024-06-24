import { Flex, Heading, Text } from '@chakra-ui/react'

export default function NotFound() {
    return (
        <Flex justify="center" align="center">
            <Heading size="lg" fontWeight="bold">
                404
            </Heading>
            <Text size="md">Page not found</Text>
        </Flex>
    )
}
