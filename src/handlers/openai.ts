import OpenAI from 'openai';
import { Assistant, AssistantCreateParams } from 'openai/resources/beta'
import * as env from 'env-var';

import { ASSISTANT } from '../prompts'

export class OpenAIHandler {
    private static instance: OpenAIHandler;

    private openai: OpenAI;
    private assistant: any;

    private constructor(openai: OpenAI, assistant: Assistant) {
        this.openai = openai;
        this.assistant = assistant;
    }

    public static async getInstance(): Promise<OpenAIHandler> {
        if (!this.instance) {
            const params = await this._init();
            this.instance = new OpenAIHandler(...params);
        }

        return this.instance
    }

    private static async _init(): Promise<[OpenAI, Assistant]> {
        const openai = new OpenAI({
            apiKey: env.get("OPENAI_API_KEY")
                .required()
                .asString(),
            organization: env.get("OPENAI_ORG")
                .asString(),
            project: env.get("OPENAI_PROJECT")
                .asString(),
        });


        const assistant = await openai.beta.assistants.create(ASSISTANT);

        return [openai, assistant];
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