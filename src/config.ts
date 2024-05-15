import { LaunchOptions } from 'playwright'

export const Config = {
    models: {
        vision: 'gpt-4o', // Used for image processing
        text: 'gpt-3.5-turbo' // Used for text processing and code generation
    },
    browser: {
        headless: false, // Set to true for production
        slowMo: 50, // Set to 0 for production
    }
} satisfies ConfigType;


type ConfigType = {
    models: {
        vision: GPTVisionModel,
        text: GPTModel,
    },
    browser: LaunchOptions,
}

type GPTModel = 'gpt-4o' | 'gpt-4-turbo' | 'gpt-4' | 'gpt-3.5-turbo';
type GPTVisionModel = 'gpt-4o' | 'gpt-4-turbo';