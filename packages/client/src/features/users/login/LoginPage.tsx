import { Card, CardBody, CardHeader, Flex, Heading } from '@chakra-ui/react'
import LoginForm from './LoginForm'

export default function LoginPage() {
    return (
        <Flex h="100%" w="100%" justify="center" align="center">
            <Card p={4} w="100%" maxW="400px">
                <CardHeader>
                    <Heading size="lg">WebWisp</Heading>
                    <Heading size="md" color="gray.500">
                        Login
                    </Heading>
                </CardHeader>
                <CardBody>
                    <LoginForm />
                </CardBody>
            </Card>
        </Flex>
    )
}
