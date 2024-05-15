import OpenAI from 'openai'
import { Assistant } from 'openai/resources/beta'
import * as env from 'env-var'

import { ASSISTANT } from '../prompts'

export class OpenAIHandler {
    private static instance: OpenAIHandler

    private client: OpenAI
    private assistant: Assistant

    private constructor(client: OpenAI, assistant: Assistant) {
        this.client = client
        this.assistant = assistant
    }

    public static async getInstance(): Promise<OpenAIHandler> {
        if (!this.instance) {
            const params = await this._init()
            this.instance = new OpenAIHandler(...params)
        }

        return this.instance
    }

    private static async _init(): Promise<[OpenAI, Assistant]> {
        const client = new OpenAI({
            apiKey: env.get('OPENAI_API_KEY')
                .required()
                .asString(),
            organization: env.get('OPENAI_ORG')
                .asString(),
            project: env.get('OPENAI_PROJECT')
                .asString(),
        })


        const assistant = await client.beta.assistants.create(ASSISTANT)

        return [client, assistant]
    }

    async close() {
        await this.client.beta.assistants.del(this.assistant.id)
    }

    async makeThread() {
        return this.client.beta.threads.create()
    }

    async deleteThread(threadId: string) {
        return this.client.beta.threads.del(threadId)
    }

    async makeMessage(threadId: string, content: string, screenshot: Buffer | null = null) {
        const contents = [
            {
                type: 'text',
                text: content,
            },
        ] as any[]

        if (screenshot) {
            contents.push({
                type: 'image_url',
                image_url: {
                    detail: 'low',
                    url: `data:image/png;base64,${screenshot.toString('base64')}==`,
                }
            })
        }

        return this.client.beta.threads.messages.create(threadId, {
            role: 'user',
            content: contents,
        })
    }

    async getMessages(threadId: string) {
        return this.client.beta.threads.messages.list(threadId)
    }

    async startRun(threadId: string) {
        return this.client.beta.threads.runs.createAndPoll(threadId, {
            assistant_id: this.assistant.id,
            instructions: 'Please execute step by step the actions described in the prompt, and reflect the results in the functions.',
        });
    }

    async cancelRun(threadId: string, runId: string) {
        return this.client.beta.threads.runs.cancel(threadId, runId)
    }
}