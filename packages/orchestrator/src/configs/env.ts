import { readFileSync } from 'fs'

let config: Config | null = null
export function useConfig(): Config {
    if (config) {
        return config
    }

    if (!process.env.CONFIG_FILE) {
        throw new Error('CONFIG_FILE not set')
    }

    config = JSON.parse(readFileSync(process.env.CONFIG_FILE, 'utf-8'))
    return config as Config
}

export interface Config {
    jwt: {
        secret: string
        expiresIn: string
    }
    users: {
        username: string
        password: string
    }[]
}
