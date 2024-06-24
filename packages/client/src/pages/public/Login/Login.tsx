import { useClient } from '@api/client'
import {
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    Flex,
    FormControl,
    FormHelperText,
    FormLabel,
    Heading,
    Input,
    Text,
    Stack,
    StackDivider,
    useColorModeValue,
} from '@chakra-ui/react'
import { useState } from 'preact/hooks'
import { ChangeEvent } from 'react'
import { navigate } from 'wouter/use-browser-location'

export default function Login(): JSX.Element {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [isUsernameValid, setIsUsernameValid] = useState(true)
    const [isPasswordValid, setIsPasswordValid] = useState(true)
    const [isLoading, setIsLoading] = useState(false)

    const [usernameError, setUsernameError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [globalError, setGlobalError] = useState('')

    const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        const target = e.target
        setPassword(target.value)

        if (
            target.value.length < 8 ||
            target.value.length > 64 ||
            !/[0-9]/.test(target.value) ||
            !/[a-z]/.test(target.value) ||
            !/[A-Z]/.test(target.value)
        ) {
            setIsPasswordValid(false)
            setPasswordError(
                'Password must be between 8 and 64 characters and contain at least one number, one lowercase letter, and one uppercase letter'
            )
        } else {
            setIsPasswordValid(true)
            setPasswordError('')
        }
        setGlobalError('')
    }
    const onUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        const target = e.target
        setUsername(target.value)

        if (target.value.length < 3) {
            setIsUsernameValid(false)
            setUsernameError('Username must be at least 3 characters long')
        } else {
            setIsUsernameValid(true)
            setUsernameError('')
        }
        setGlobalError('')
    }

    const onSubmit = async () => {
        setIsLoading(true)
        try {
            const result = await useClient().auth.login(username, password)
            if (!result) {
                setGlobalError('Invalid username or password')
            } else {
                navigate('/')
            }
        } catch (error) {
            console.error(error)
            setGlobalError('An error occurred. Please try again later.')
        } finally {
            setIsLoading(false)
        }
    }

    const isFormValid =
        isUsernameValid &&
        isPasswordValid &&
        password.length > 0 &&
        username.length > 0

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
                    <Stack divider={<StackDivider />} spacing={4}>
                        <Flex direction="column" gap={4}>
                            <FormControl
                                isRequired
                                isInvalid={!isUsernameValid}
                            >
                                <FormLabel>Username</FormLabel>
                                <Input
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={onUsernameChange}
                                />
                                {usernameError && (
                                    <FormHelperText
                                        color={useColorModeValue(
                                            'red.500',
                                            'red.300'
                                        )}
                                    >
                                        {usernameError}
                                    </FormHelperText>
                                )}
                            </FormControl>
                            <FormControl
                                isRequired
                                isInvalid={!isPasswordValid}
                            >
                                <FormLabel>Password</FormLabel>
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={onPasswordChange}
                                />
                                {passwordError && (
                                    <FormHelperText
                                        color={useColorModeValue(
                                            'red.500',
                                            'red.300'
                                        )}
                                    >
                                        {passwordError}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Flex>
                        <Box>
                            {globalError && (
                                <Text
                                    color={useColorModeValue(
                                        'red.500',
                                        'red.300'
                                    )}
                                >
                                    {globalError}
                                </Text>
                            )}
                            <Button
                                colorScheme="blue"
                                type="submit"
                                isDisabled={!isFormValid}
                                isLoading={isLoading}
                                onClick={onSubmit}
                            >
                                Submit
                            </Button>
                        </Box>
                    </Stack>
                </CardBody>
            </Card>
        </Flex>
    )
}
