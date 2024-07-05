import axios from 'axios'
import { navigate } from 'wouter-preact/use-browser-location'

export const BASE_URL = import.meta.env.DEV
    ? 'http://localhost:3000/api'
    : `${location.origin}/api`

export const formatUrl = (path: string) => {
    return `${BASE_URL}${path}`
}

axios.defaults.baseURL = BASE_URL
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('access-token')
            navigate('/login')
        }
        return Promise.reject(error)
    }
)
