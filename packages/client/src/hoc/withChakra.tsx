import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { ReactNode } from 'preact/compat'

const theme = extendTheme({})

const withChakra = (node: ReactNode) => (
    <ChakraProvider theme={theme}>{node}</ChakraProvider>
)

export default withChakra
