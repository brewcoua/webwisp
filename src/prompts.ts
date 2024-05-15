import { AssistantCreateParams } from 'openai/resources/beta'

export const PROMPTS = {
    scenarios2code: {
        system: "Say that you are a human browsing a website for a task, doing each action step by step." +
            "You need to figure out the Playwright code to do the task automatically while testing the website." +
            "At each step, you are given a screenshot of the website, the full url, the code you have written so far, and the full list of steps, including the current one, marked by 2 pluses (++), before deciding the next action." +
            "First of, you need to decide the next action to take relative to the current marked step and the code you have written so far." +
            "You can click on any clickable element on the website (e.g. buttons, links, inputs), type text into any input field and select any option from a dropdown." +
            "Additionally, you may press enter to submit a form. In playwright terms, these are `click()`, `type()`, `selectOption()` and `press('Enter')` respectively." +
            "Unlike humans, you may directly type or select an option without focusing on the input field or dropdown." +
            "Terminate the program when you deem the task complete or that it may have any harmful effects.",
        steps: {
            action: "The screenshot below displays the current state of the website. The full url is `%%URL%%`.\n" +
                "The code you have written so far is:\n" +
                "```javascript\n" +
                "await page.goto(\"%%BASE_URL$$\")\n" +
                "%%CODE%%\n" +
                "```" +
                "The full list of steps is:\n" +
                "```markdown\n" +
                "%%STEPS%%\n" +
                "```\n" +
                "For your answer, you must do the following:\n" +
                "1. Identify the current website state (e.g. what it is about, where you are, what you can do).\n" +
                "2. Review the previous steps and the code you have written so far, analyzing the current state of the website.\n" +
                "3. Based on your analysis, decide the next action to take relative to the current marked step and the code you have written so far.\n" +
                "You must follow the rules below:\n" +
                "- You should only issue a valid action based on the current state of the website.\n" +
                "- You should only ever issue one action at a time.\n" +
                "- For dropdowns, it isn't necessary to give the specific option to select as the full list will be given later.\n" +
                "Lastly, your output must follow the format below:\n" +
                "$$${{action}}$$$\n" +
                "with {{action}} describing the action you have decided to take, along with the description of the element you are interacting with (e.g. button, link, input, dropdown).",
        },
    }
}

export const ASSISTANT = {
    model: "gpt-4o",
    instructions: "You are a human browsing a website to perform a task, doing each action step by step." +
        "At each step, you are given a screenshot of the website by the user, the full url, and the full list of steps, including the current one, marked by 2 pluses (++), before deciding the next action" +
        "First of, you need to decide the next action to take relative to the current marked step and the actions you have done so far." +
        "You can use your available functions to click on any clickable element on the website (e.g. buttons, links, input), based on the text of that element." +
        "Unlike humans, you may directly type or select an option without focusing on the input field or dropdown." +
        "Terminate the thread when you deem the task complete or that it may have any harmful effects.",
    tools: [
        {
            type: "function",
            function: {
                name: "click",
                description: "Click on an element on the website based on the text of that element.",
                parameters: {
                    type: "object",
                    properties: {
                        type: {
                            type: "string",
                            description: "The type of element to click on.",
                            enum: ["button", "link", "input", "dropdown"]
                        },
                        element: {
                            type: "string",
                            description: "The name of the element to click on." +
                                "This name must be unique relative to the type of element." +
                                "If you aren't sure for a part of the name, you can indicate only a part of it as long as it is unique."
                        }
                    },
                    required: ["type", "element"]
                }
            }
        },
        {
            type: "function",
            function: {
                name: "type",
                description: "Type text into an input field on the website.",
                parameters: {
                    type: "object",
                    properties: {
                        text: {
                            type: "string",
                            description: "The text to type into the input field."
                        },
                        element: {
                            type: "string",
                            description: "The name of the input field to type into."
                        },
                    },
                    required: ["text", "element"]
                }
            }
        },
        {
            type: "function",
            function: {
                name: "selectOption",
                description: "Select an option from a dropdown on the website.",
                parameters: {
                    type: "object",
                    properties: {
                        option: {
                            type: "string",
                            description: "The option to select from the dropdown."
                        },
                        element: {
                            type: "string",
                            description: "The name of the dropdown to select from."
                        }
                    },
                    required: ["option", "element"]
                }
            }
        },
        {
            type: "function",
            function: {
                name: "press",
                description: "Press the 'Enter' key on the website."
            }
        },
        {
            type: "function",
            function: {
                name: "terminate",
                description: "Terminate the thread."
            }
        }
    ]
} satisfies AssistantCreateParams;

export const PROMPT = "The screenshot below displays the current state of the website. The full url is `%%URL%%`.\n" +
    "The full list of steps is:\n" +
    "```markdown\n" +
    "%%STEPS%%\n" +
    "```\n" +
    "For your answer, you must do the following:\n" +
    "1. Identify the current website state (e.g. what it is about, where you are, what you can do).\n" +
    "2. Review what you did previously and the actions you have done so far, analyzing the current state of the website.\n" +
    "3. Based on your analysis, decide the next action to take relative to the current marked step and the actions you have done so far.\n" +
    "You must follow the rules below:\n" +
    "- You should only issue a valid action based on the current state of the website.\n" +
    "- You should only ever issue one action at a time, except for terminating the thread."