import { extendTheme } from '@chakra-ui/react'

// Make gray colors almost black
const colors = {
    gray: {
        900: '#090202',
        800: '#0e181c',
        700: '#1c2b33',
        600: '#2a3e4a',
        500: '#3a5266',
        400: '#4c6682',
        300: '#6a819f',
        200: '#8c9dbb',
        100: '#b0bacf',
        50: '#e3e8f0',
    },
    blue: {
        // Make blue colors less vibrant, darker
        900: '#0c2d48',
        800: '#12283a',
        700: '#1b3147',
        600: '#1f3e5a',
        500: '#2d4f6c',
        400: '#3a607f',
        300: '#4c7497',
        200: '#6a8fae',
        100: '#9cb5c9',
        50: '#e4f1f9',
    },
}

const theme = extendTheme({
    theme: {
        initialColorMode: 'light',
    },
})

export default theme
