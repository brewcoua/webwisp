import axios from 'axios'
import { ReactNode } from 'preact/compat'

const withAuthorization = (node: ReactNode) => {
    // Set default headers for axios
    const token = localStorage.getItem('access-token')
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }

    return node
}

export default withAuthorization
