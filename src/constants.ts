import OpenAI from 'openai'
import { BrowserContextOptions, LaunchOptions } from 'playwright'

export enum ActionType {
    Click = 'click',
    Type = 'type',
    PressEnter = 'press_enter',
    ScrollDown = 'scroll_down',
    ScrollUp = 'scroll_up',
    Done = 'done',
    Fail = 'fail',
}

export const CONFIG: Config = {
    fine_tuning: {
        temperature: 0.7,
    },
    api: {
        model: 'gpt-4o',
        ratelimit: 0.5,
        delay: 0,
        max_tokens: 1500,
        max_cycles: 10,
        max_failed_cycles: 3,
    },
    browser: {
        type: 'chromium',
        options: {
            headless: false,
            slowMo: 50,
            args: ['--disable-web-security'],
        },
        context: {
            bypassCSP: true,
            recordVideo: {
                dir: 'videos',
            },
        },
        viewport: {
            width: 1280,
            height: 720,
        },
        screenshotsDir: 'dist/img',
    },
}

export const PROMPTS: Prompts = {
    system: `
You are a human browsing a website to perform a task, doing each action step by step.
After every action, you are given a screenshot of the website by the user, the full url, the title of the page, and the list of your previous actions.
You must decide the next action to take based on the current state of the website and the actions you have done so far. Only ever issue a valid action based on the current state of the website.
There are labels on all visible clickable elements on the website, which are colored. Use the label number to identify the element you are interacting with.
If you encounter a cookie consent banner, close it as soon as possible.
Keep it simple, do as little as possible to complete the task. Do not overthink it. For example, if you can search for something instead of navigating through the interface, then do it. For search results, do not scroll unless strictly necessary, just enough to see the first few, and you do not need to go on another website as long as you have a name.
When you wish to type something, only use the 'type' action and avoid unnecessary actions such as 'press_enter'.
Only issue one action at a time (e.g. You may not type AND press enter). After each action, the user will provide you with a new screenshot, the full url, the title of the page, and the list of your previous actions.
Once you believe the task is complete, issue the action 'done' with the final output message for task completion and a value if needed (as in, the actual raw value that you were asked for, e.g. a restaurant name or 'yes' / 'no').
For the final description, you must describe why you believe the task is complete, and what you have found (e.g. 'The lowest price is $10.99 for the item').
Always keep triple tildes \`~~~\` to allow the system to parse your answer correctly.
Possible actions are: ${Object.values(ActionType)
        .map((action) => `'${action}'`)
        .join(', ')}.
For your answer, you must follow the template below, without including <template> tags:
<template>
## Current State ##
Describe the current state of the website.
## Actions Done So Far ##
Describe the actions you have done so far.
## Next Action ##
Describe the next action to take.
~~~
DESCRIPTION: <REQUIRED, description of the action, to be recalled later (e.g. Click on the \'Next\' button), or final output message for task completion>
ACTION: <${Object.values(ActionType)
        .map((action) => `'${action}'`)
        .join(' | ')}>
ELEMENT: <label of the element, MUST be a valid number, optional when not interacting>
VALUE: <optional, value to type or value for task completion, on done>
~~~
</template>`,
    user: `
TITLE: %%TITLE%%
URL: \`%%URL%%\`
TASK: %%TASK%%
PREVIOUS ACTIONS:
%%ACTIONS%%`,
}

export const REGEX = {
    url: /^https?:\/\/([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}(:\d{1,5})?/i,
    domain: /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}(:\d{1,5})?$/i,
    ip: /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(:\d{1,5})?$/,
    localhost: /^localhost(:\d{1,5})?$/,
}

// TYPES

export type Config = {
    // Fine-tuning options for the agent
    fine_tuning: {
        // Temperature to use for completions
        temperature?: number
    }
    api: {
        // Model to be used for completions. (MUST be multimodal)
        model: OpenAI.ChatModel
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
    }
    browser: {
        // Browser type to use (e.g. chromium, firefox)
        type: BrowserType
        // Browser options to use (for playwright)
        options: LaunchOptions
        // Browser context options to use (for playwright)
        context: BrowserContextOptions
        // Viewport size to use
        viewport?: {
            width: number
            height: number
        }
        // Directory to save screenshots
        screenshotsDir: string
    }
    // List of predefined tasks to perform on the target
    tasks?: Task[]
}

export type Element = 'text' | ClickableElement
export type ClickableElement = 'button' | 'link' | 'textbox' | 'combobox'

type Task = {
    objective: string
    scenario: string[][]
}

type URL = `http${'' | 's'}://${string}`
type BrowserType = 'chromium' | 'firefox'

export type Prompts = {
    user: string
    system: string
}
