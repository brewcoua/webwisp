import { BrowserContextOptions, LaunchOptions } from 'playwright'
import OpenAI from 'openai'

export enum Methods {
    Attributes = 'attrib',
    Visual = 'visual',
}

export type Config = {
    // If unspecified, the agent will prompt for a target URL
    target?: URL,
    // If unspecified, the agent will prompt for a task
    task?: string,
    // Fine-tuning options for the agent
    fine_tuning: {
        // Whether to resize screenshots before sending them to the model, this allows saving tokens
        resize?: {
            width: number,
            height: number,
            keep_aspect_ratio?: boolean,
        }
    },
    api: {
        // Model to be used for completions. (MUST be multimodal)
        model: OpenAI.ChatModel,
        // Rate limit for OpenAI API, in requests per second
        ratelimit: number,
        // Time in ms to wait between each step. Useful for debugging
        delay: number,
        // Maximum number of tokens to use in each completion
        max_tokens: number,
        // Maximum number of cycles to run on the same step before hard stopping
        max_cycles: number,
        // Maximum number of failed cycles before hard stopping
        max_failed_cycles: number,
    },
    browser: {
        // Browser type to use (e.g. chromium, firefox)
        type: BrowserType,
        // Browser options to use (for playwright)
        options: LaunchOptions,
        // Browser context options to use (for playwright)
        context: BrowserContextOptions,
        // Viewport size to use
        viewport?: {
            width: number,
            height: number,
        },
        // Directory to save screenshots
        screenshotsDir: string,
    },
    // List of predefined tasks to perform on the target
    tasks?: Task[],
}

export type Element = 'text' | ClickableElement;
export type ClickableElement = 'button' | 'link' | 'textbox' | 'combobox';

type Task = {
    objective: string,
    scenario: string[][],
}

type URL = `http${'' | 's'}://${string}`;
type BrowserType = 'chromium' | 'firefox';

export type Prompts = {
    user: string[],
    system: string[],
}
