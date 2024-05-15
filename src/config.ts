import { LaunchOptions } from 'playwright'

export function useConfig(): Readonly<Config> {
    return Object.freeze(config);
}

const config: Config = {
    target: 'https://labri.brewen.dev',
    delay: 4000,
    models: {
        vision: 'gpt-4o',
        text: 'gpt-3.5-turbo',
    },
    browser: {
        type: 'chromium',
        options: {
            headless: false,
            slowMo: 50,
        },
        viewport: {
            width: 1920,
            height: 1080,
        },
    },
    tasks: [
        {
            objective: 'Log in to the website with username "robot" and password "12345678"',
            scenario: [
                [
                    'Click on the \'login\' link',
                    'Focus on the \'username\' input field',
                    'Type \'robot\'',
                    'Focus on the \'password\' input field',
                    'Type \'12345678\'',
                    'Click on the \'submit\' button',
                    'Verify that the user is logged in',
                ],
            ],
        },
    ],
}

type Config = {
    // If unspecified, the agent will prompt for a target URL
    target: URL,
    // Delay in milliseconds between each action
    delay?: number,
    models: {
        // Model to use for image processing
        vision: GPTVisionModel,
        // Model to use for text processing and code generation
        text: GPTModel,
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

type GPTModel = 'gpt-4o' | 'gpt-4-turbo' | 'gpt-4' | 'gpt-3.5-turbo';
type GPTVisionModel = 'gpt-4o' | 'gpt-4-turbo';
