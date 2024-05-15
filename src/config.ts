import { LaunchOptions } from 'playwright'
import input from '@inquirer/input';

const config: ConfigInput = {
    models: {
        vision: 'gpt-4o', // Used for image processing
        text: 'gpt-3.5-turbo', // Used for text processing and code generation
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
        }
    },
}

type ConfigInput = Omit<Config, 'target'> & {
    target?: URL,
}

type Config = {
    // If unspecified, the agent will prompt for a target URL
    target: URL,
    models: {
        vision: GPTVisionModel,
        text: GPTModel,
    },
    browser: {
        type: BrowserType,
        options: LaunchOptions,
        viewport?: {
            width: number,
            height: number,
        }
    },
}

type URL = `http${'' | 's'}://${string}`;
type BrowserType = 'chromium' | 'firefox';

type GPTModel = 'gpt-4o' | 'gpt-4-turbo' | 'gpt-4' | 'gpt-3.5-turbo';
type GPTVisionModel = 'gpt-4o' | 'gpt-4-turbo';



const prompts = {
    target: {
        message: 'Enter target URL',
        validate: (input: string) => {
            try {
                new URL(input);
                return true;
            } catch {
                return 'Invalid URL';
            }
        }
    },
};

export async function useConfig(): Promise<Config> {
    if (!config.target) {
        config.target = await input(prompts.target) as URL;
    }

    return config as Config;
}

