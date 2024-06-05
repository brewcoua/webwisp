import OpenAI from 'openai'

import Logger from '../logger'
import Service from '../domain/Service'
import { getConfig } from '@/domain/Config'

export default class OpenAIService extends Service {
    private client!: OpenAI

    constructor() {
        super('openai')
    }

    public static makeClient(): OpenAI {
        const apiKey = process.env.OPENAI_API_KEY
        if (!apiKey) {
            throw new Error('No OpenAI API key provided')
        }

        return new OpenAI({
            apiKey,
            organization: process.env.OPENAI_ORG,
            project: process.env.OPENAI_PROJECT,
        })
    }

    async initialize(): Promise<void> {
        Logger.debug('Initializing OpenAI service')
        this.client = OpenAIService.makeClient()
    }

    async destroy(): Promise<void> {}

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
        tool_choice?: OpenAI.ChatCompletionToolChoiceOption
    ): Promise<OpenAI.ChatCompletion> {
        return this.client.chat.completions.create({
            model: getConfig().api.model,
            messages,
            tools,
            tool_choice,
            max_tokens: getConfig().api.max_tokens,
            temperature: getConfig().fine_tuning.temperature,
        })
    }
}
