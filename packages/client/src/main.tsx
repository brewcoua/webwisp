import { render } from 'preact'

import { ChakraProvider } from '@chakra-ui/react'

import theme from './configs/theme'
import App from './App'
import './assets/style.scss'

render(
    <ChakraProvider theme={theme}>
        <App />
    </ChakraProvider>,
    document.getElementById('root')!
)
