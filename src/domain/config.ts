import { BrowserContextOptions, LaunchOptions } from 'playwright'

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
    actions: Record<ActionType, Action>
}

type AvailableModels = 'gpt-4o'
type BrowserType = 'chromium' | 'firefox' | 'webkit'

export enum ActionType {
    Click = 'click',
    Type = 'type',
    PressEnter = 'press_enter',
    Scroll = 'scroll',

    Back = 'back',
    Forward = 'forward',
    Done = 'done',
}

export type Action = {
    description: string
    arguments?: {
        name: string
        type: 'string' | 'number' | 'boolean'
        enum?: string[]
        required?: boolean
    }[]
}

export type CalledAction = {
    type: ActionType
    description: string
    arguments: Record<string, string | number | boolean>
    status?: CalledActionStatus
}
export enum CalledActionStatus {
    Success = 'success',
    Failed = 'failed',
}

export type TaskResult = {
    success: boolean
    message: string
    value?: string
}

export type ImageURL = `data:image/${string};base64,${string}`
