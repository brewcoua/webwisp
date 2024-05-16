import { Service } from '../domain/service'
import { usePrompts } from '../hooks'

import { Logger } from 'pino'
import * as env from 'env-var'

import OpenAI from 'openai'
import { Assistant, Thread } from 'openai/resources/beta'
import { AssistantStream } from 'openai/lib/AssistantStream'

export type ToolOutput = {
    tool_call_id?: string
    output?: string
}

export class OpenAIService extends Service {
    private client!: OpenAI
    private assistant!: Assistant
    private threads: Thread[] = []

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
        await this.client.beta.assistants.del(this.assistant.id)
    }

    async make_thread(): Promise<Thread> {
        const thread = await this.client.beta.threads.create()
        this.threads.push(thread)

        return thread
    }

    async delete_thread(threadId: string): Promise<void> {
        await this.client.beta.threads.del(threadId)
        this.threads = this.threads.filter(thread => thread.id !== threadId)
    }

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