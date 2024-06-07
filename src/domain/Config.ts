import { BrowserContextOptions, LaunchOptions } from 'playwright'

import ActionType from '../services/runner/domain/ActionType'
import type AbstractAction from '../services/runner/domain/AbstractAction'

export type Config = {
    // Fine-tuning options for the agent
    fine_tuning: {
        // Temperature to use for completions
        temperature?: number
    }
    api: {
        // Model to be used for completions. (MUST be multimodal)
        model: AvailableModels
        // Rate limit for OpenAI API, in requests per second
        ratelimit: number
        // Time in ms to wait between each step. Useful for debugging
        delay: number
        // Maximum number of tokens to use in each completion
        max_tokens: number
        // Maximum number of cycles to run on the same step before hard stopping
        max_cycles: number
        // Maximum number of failed cycles before hard stopping
        max_failed_cycles: number
        // Maximum number of retries for format errors (e.g. model not following the format, leading to parsing errors)
        max_failed_formatting: number

        // The total max possible tokens is max_cycles * max_failed_formatting * max_tokens
    }
    browser: {
        // Browser type to use (e.g. chromium, firefox)
        type: BrowserType
        // Browser options to use (for playwright)
        options: LaunchOptions
        // Browser context options to use (for playwright)
        context: BrowserContextOptions
        // Viewport size to use
        viewport: {
            width: number
            height: number
        }
        // Directory to save screenshots
        screenshotsDir: string
    }
    prompts: {
        system: {
            // Base system prompt for setting the basic context and format
            introduction: string
            examples: {
                // Message added to the prompt for indicating the presence of examples
                message: string
                list: {
                    // Path to the example screenshot
                    screenshot: string
                    // Example user prompt
                    prompt: string
                    // Example output completion
                    completion: string
                }[]
            }
        }
        user: {
            // User prompt, including placeholders
            prompt: string
        }
    }
    // Information about the available actions, later injected into the prompt
    actions: Record<ActionType, AbstractAction>
}

// @ts-ignore - Parsed by vite-plugin-toml
import config from '@/config.toml'

export const getConfig = (): Config => config

type AvailableModels = 'gpt-4o'
type BrowserType = 'chromium' | 'firefox' | 'webkit'
