import { Service } from '../domain/service'
import { usePrompts } from '../hooks'

import { Logger } from 'pino'
import * as env from 'env-var'

import OpenAI from 'openai'
import { Assistant, AssistantStream, Message, MessageCreateParams, MessagesPage, Thread } from '../domain/openai'
import fs from 'node:fs'

export type ToolOutput = {
    tool_call_id?: string
    output?: string
}

export class OpenAIService extends Service {
    private client!: OpenAI
    private assistant!: Assistant
    private threads: Thread[] = []
    private files: string[] = []

    constructor(logger: Logger) {
        super(
            logger.child({ service: 'openai' }),
            'openai',
        )
    }

    async initialize(): Promise<void> {
        this.debug('Initializing OpenAI service')
        this.client = new OpenAI({
            apiKey: env.get('OPENAI_API_KEY')
                .required()
                .asString(),
            organization: env.get('OPENAI_ORG')
                .asString(),
            project: env.get('OPENAI_PROJECT')
                .asString(),
        })

        this.assistant = await this.client.beta.assistants.create(usePrompts().assistant)
    }

    async destroy(): Promise<void> {
        for (const thread of this.threads) {
            await this.client.beta.threads.del(thread.id)
        }
        for (const file of this.files) {
            await this.client.files.del(file)
        }
        await this.client.beta.assistants.del(this.assistant.id)
    }

    // Threads

    async make_thread(): Promise<Thread> {
        const thread = await this.client.beta.threads.create()
        this.threads.push(thread)

        return thread
    }

    async delete_thread(threadId: string): Promise<void> {
        await this.client.beta.threads.del(threadId)
        this.threads = this.threads.filter(thread => thread.id !== threadId)
    }

    async add_message(threadId: string, message: MessageCreateParams): Promise<Message> {
        return this.client.beta.threads.messages.create(threadId, message);
    }

    async delete_message(threadId: string, messageId: string): Promise<void> {
        await this.client.beta.threads.messages.del(threadId, messageId);
    }

    async list_messages(threadId: string): Promise<MessagesPage> {
        return this.client.beta.threads.messages.list(threadId) as any;
    }

    // Files

    async upload_file(threadId: string, path: string): Promise<string> {
        const file = await this.client.files.create({
            file: fs.createReadStream(path),
            purpose: 'assistants',
        });
        this.files.push(file.id);

        return file.id;
    }

    async delete_file(fileId: string): Promise<void> {
        await this.client.files.del(fileId);
        this.files = this.files.filter(file => file !== fileId);
    }

    // Runs

    async stream_run(threadId: string): Promise<AssistantStream> {
        return this.client.beta.threads.runs.stream(threadId, {
            assistant_id: this.assistant.id,
        })
    }

    async submit_tool_outputs(threadId: string, runId: string, outputs: ToolOutput[]): Promise<AssistantStream> {
        return this.client.beta.threads.runs.submitToolOutputsStream(
            threadId,
            runId,
            { tool_outputs: outputs },
        )
    }
}