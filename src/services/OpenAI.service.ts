import { Service } from '../domain/Service'
import { useConfig } from '../hooks'

import { Logger } from 'pino'
import * as env from 'env-var'

import OpenAI from 'openai'

export class OpenAIService extends Service {
    private client!: OpenAI

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
    }

    async destroy(): Promise<void> {

    }

    // Completions

    /**
     * Complete a message from a model
     * @param messages Messages to send to the model
     * @param tools Tools that can be called by the model
     * @param tool_choice Whether to choose between calling tools or generating a message.
     *                    Can also force the model to call at least one tool
     *                    (default: 'auto')
     * @returns The completion of the message
     */
    async completion(
        messages: OpenAI.ChatCompletionMessageParam[],
        tools?: OpenAI.ChatCompletionTool[],
        tool_choice?: OpenAI.ChatCompletionToolChoiceOption,
    ): Promise<OpenAI.ChatCompletion> {
        return this.client.chat.completions.create({
            model: useConfig().api.model,
            messages,
            tools,
            tool_choice,
            max_tokens: useConfig().api.max_tokens,
        })
    }
}