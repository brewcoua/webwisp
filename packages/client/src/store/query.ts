import axios from 'axios'

export const BASE_URL = import.meta.env.DEV
    ? 'http://localhost:3000/api'
    : '/api'

export const formatUrl = (path: string) => {
    return `${BASE_URL}${path}`
}

axios.defaults.baseURL = BASE_URL
