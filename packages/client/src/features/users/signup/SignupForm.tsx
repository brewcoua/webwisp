import { useAppDispatch } from '@store/hooks'
import { useState } from 'preact/hooks'
import { signUp } from '../user.slice'
import { navigate } from 'wouter-preact/use-browser-location'
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormHelperText,
    FormLabel,
    Input,
    Stack,
    StackDivider,
    Text,
    useColorModeValue,
} from '@chakra-ui/react'

export default function SignupForm() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [isUsernameValid, setIsUsernameValid] = useState(true)
    const [isPasswordValid, setIsPasswordValid] = useState(true)
    const [isLoading, setIsLoading] = useState(false)

    const [usernameError, setUsernameError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [globalError, setGlobalError] = useState('')

    const dispatch = useAppDispatch()

    const onPasswordChange = (e: any) => {
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
    const onUsernameChange = (e: any) => {
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
            const result = await dispatch(signUp(username, password))
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
        <Stack divider={<StackDivider />} spacing={4}>
            <Flex direction="column" gap={4}>
                <FormControl isRequired isInvalid={!isUsernameValid}>
                    <FormLabel>Username</FormLabel>
                    <Input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={onUsernameChange}
                    />
                    {usernameError && (
                        <FormHelperText
                            color={useColorModeValue('red.500', 'red.300')}
                        >
                            {usernameError}
                        </FormHelperText>
                    )}
                </FormControl>
                <FormControl isRequired isInvalid={!isPasswordValid}>
                    <FormLabel>Password</FormLabel>
                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={onPasswordChange}
                    />
                    {passwordError && (
                        <FormHelperText
                            color={useColorModeValue('red.500', 'red.300')}
                        >
                            {passwordError}
                        </FormHelperText>
                    )}
                </FormControl>
            </Flex>
            <Box>
                {globalError && (
                    <Text color={useColorModeValue('red.500', 'red.300')}>
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
    )
}
