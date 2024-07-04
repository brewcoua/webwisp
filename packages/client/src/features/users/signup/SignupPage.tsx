import { Card, CardBody, CardHeader, Flex, Heading } from '@chakra-ui/react'
import { ReactNode } from 'preact/compat'
import SignupForm from './SignupForm'

export default function SignupPage() {
    return (
        <Flex h="100%" w="100%" justify="center" align="center">
            <Card p={4} w="100%" maxW="400px">
                <CardHeader>
                    <Heading size="lg">WebWisp</Heading>
                    <Heading size="md" color="gray.500">
                        SignUp
                    </Heading>
                </CardHeader>
                <CardBody>
                    <SignupForm />
                </CardBody>
            </Card>
        </Flex>
    )
}
