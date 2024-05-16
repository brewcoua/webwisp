import { LaunchOptions } from 'playwright'
import { AssistantCreateParams } from 'openai/resources/beta'

export type Config = {
    // If unspecified, the agent will prompt for a target URL
    target: URL,
    // Rate limit for OpenAI API, in requests per second
    ratelimit: number,
    browser: {
        // Browser type to use (e.g. chromium, firefox)
        type: BrowserType,
        // Browser options to use (for playwright)
        options: LaunchOptions,
        // Viewport size to use
        viewport?: {
            width: number,
            height: number,
        }
    },
    // List of predefined tasks to perform on the target
    tasks?: Task[],
}

type Task = {
    objective: string,
    scenario: string[][],
}

type URL = `http${'' | 's'}://${string}`;
type BrowserType = 'chromium' | 'firefox';

export type Prompts = {
    assistant: AssistantCreateParams,
    user: string[],
}