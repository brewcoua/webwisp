import { LaunchOptions } from 'playwright'
import { AssistantCreateParams } from 'openai/resources/beta'
import OpenAI from 'openai'
import { ClickableElement } from '../services/Playwright.service'

export type Config = {
    // If unspecified, the agent will prompt for a target URL
    target: URL,
    finetuning: {
        // HSL distance for background color matching
        hue_distance: number,
        saturation_distance: number,
        lightness_distance: number,
        // Maximum distance between two elements to be considered neighbors
        max_neighbor_radius: number,
        // Selectors for each clickable element
        selectors: {
            [key in ClickableElement]: string[]
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
    },
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
    system: string[],
    tools: OpenAI.ChatCompletionTool[],
    user: string[],
}