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

const ActionTypeDescription: Record<ActionType, string> = {
    [ActionType.Click]: 'Click on a clickable element (need label number)',
    [ActionType.Type]:
        'Type in an editable element (striped, need label number)',
    [ActionType.PressEnter]:
        'Press enter in the focused element (does not replace a type action)',
    [ActionType.ScrollDown]: 'Scroll down 2/3 of the window height',
    [ActionType.ScrollUp]: 'Scroll up 2/3 of the window height',
    [ActionType.Done]: 'Done, task is complete',
    [ActionType.Fail]: 'Fail, task cannot be completed',
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
            width: 1440,
            height: 900,
        },
        screenshotsDir: 'dist/img',
    },
}

export const PROMPTS: Prompts = {
    system: `
You are a human browsing a website to verify that a certain task can be completed.
After every action, you are given a screenshot of the website by the user, the full url, the title of the page, and the list of your previous actions, which you wrote yourself.
This means that you can, if needed, keep specific information in mind to help you complete the task.
You must decide the next action to take based on the current state of the website and the actions you have done so far. Only ever issue a valid action based on the current state of the website.
Keep it simple, do as little as possible to complete the task without going all the way. For example, if you can search for something instead of navigating through the interface, then do it. For search results, do not scroll unless strictly necessary, just enough to see the first few, and you do not need to go on another website as long as you have a name.
You are given actions that you can take to interact with the website, such as clicking on a button or typing in a textbox.
Once you believe the task is complete, issue the action 'done' with the final output message for task completion and a value if needed (as in, the actual raw value that you were asked for, e.g. a restaurant name or 'yes' / 'no').
If you believe the task cannot be completed, issue the action 'fail' with the reason why you believe the task cannot be completed.
For the final description, you must describe why you believe the task is complete, as in your reasoning for the completion, and the final value if needed.
Always keep triple tildes \`~~~\` to allow the system to parse your answer correctly.
Possible actions are: ${Object.values(ActionType)
        .map((action) => ` - '${action}': ${ActionTypeDescription[action]}`)
        .join('\n')}.
There are labels on all visible clickable elements on the website, which are colored. Use the label number to identify the element you are interacting with.
Elements that are editable have a striped background, which means only those elements can be typed into.
If you encounter a cookie consent banner, close it as soon as possible.
In the template, required parameters are marked with '<' and '>', and optional parameters are marked with '[' and ']'. However, some may be required depending on the action.
For your answer, you must follow the template below character by character for parsing, without including <template> tags:
<template>
## Current State ##
Describe the current state of the website.
## Actions Done So Far ##
Describe the actions you have done so far.
## Next Action ##
Describe the next action to take, and why you believe it is the correct action.
~~~
DESCRIPTION: <description of the action for you to recall, or final output message for task completion>
ACTION: <${Object.values(ActionType)
        .map((action) => `'${action}'`)
        .join(' | ')}>
ELEMENT: [label number of the element to interact with, required for 'click' and 'type']
VALUE: [final value for task completion, required for 'done']
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
