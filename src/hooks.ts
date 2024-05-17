import fs from 'node:fs'
import { Config, Prompts } from './domain/Public'
import { None, Option, Some } from 'oxide.ts'

const CACHE: {
    config: Option<Config>,
    prompts: Option<Prompts>,
} = {
    config: None,
    prompts: None,
}

export function useConfig(): Readonly<Config> {
    if (CACHE.config.isNone()) {
        const configStr = fs.readFileSync('public/config.json', 'utf-8')
        if (!configStr) {
            throw new Error('Failed to read config file at public/config.json')
        }
        CACHE.config = Some(JSON.parse(configStr))
    }
    return Object.freeze(CACHE.config.unwrap())
}

export function usePrompts(): Readonly<Prompts> {
    if (CACHE.prompts.isNone()) {
        const promptsStr = fs.readFileSync('public/prompts.json', 'utf-8')
        if (!promptsStr) {
            throw new Error('Failed to read prompts file at public/prompts.json')
        }
        CACHE.prompts = Some(JSON.parse(promptsStr))
    }
    return Object.freeze(CACHE.prompts.unwrap())
}
