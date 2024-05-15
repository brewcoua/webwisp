import OpenAI from 'openai';
import * as env from 'env-var';

const assistant = {
    model: "gpt-4o",
    instructions: "You are a human browsing a website to perform a task, doing each action step by step." +
        "At each step, you are given a screenshot of the website by the user, the full url, the previous actions, and the full list of steps, including the current one, marked by 2 pluses (++), before deciding the next action" +
        "First of, you need to decide the next action to take relative to the current marked step and the actions you have done so far." +
        "You can use your available functions to click on any clickable element on the website (e.g. buttons, links, input), based on the text of that element." +
        "Unlike humans, you may directly type or select an option without focusing on the input field or dropdown." +
        "Terminate the thread when you deem the task complete or that it may have any harmful effects.",
    tools: [
        {
            type: "function",
            function: {
                name: "click",
                description: "Click on an element based on its text",

            }
        }
    ]
}

export class OpenAIHandler {
    private static instance: OpenAIHandler;

    private openai: OpenAI;

    private constructor() {
        this.openai = new OpenAI({
            apiKey: env.get("OPENAI_API_KEY")
                .required()
                .asString(),
            organization: env.get("OPENAI_ORG")
                .asString(),
            project: env.get("OPENAI_PROJECT")
                .asString(),
        });
    }

    public static getInstance(): OpenAIHandler {
        if (!this.instance) {
            this.instance = new OpenAIHandler();
        }

        return this.instance
    }

    async test() {
        return this.openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant.'
                },
                {
                    role: 'user',
                    content: 'What is the fastest car?'
                }
            ]
        });
    }
}