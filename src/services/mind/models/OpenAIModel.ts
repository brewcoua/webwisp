import OpenAI from 'openai'

import WebwispError from '@/domain/WebwispError'

import MindModel from './MindModel'
import GenerationResponse from '../domain/GenerationResponse'
import Message from '../domain/Message'
import OpenAIMapper from '../mappers/OpenAIMapper'

import config from '../MindConfig'
import { GenerationError } from '../MindErrors'

export default class OpenAIModel extends MindModel<OpenAI> {
    protected readonly client: OpenAI
    protected readonly mapper: OpenAIMapper

    constructor() {
        super('OpenAI')

        if (!process.env.OPENAI_API_KEY) {
            throw new WebwispError('OPENAI_API_KEY is not set')
        }

        this.client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            organization: process.env.OPENAI_ORG,
            project: process.env.OPENAI_PROJECT,
        })
        this.mapper = new OpenAIMapper()
    }

    public async generate(messages: Message[]): Promise<string | null> {
        const modelMessages = this.mapper.message.toModels(messages)

        try {
            const result = await this.client.chat.completions.create({
                model: config.options.model,
                messages: modelMessages,
                temperature: config.options.temperature,
                max_tokens: config.options.max_tokens,
            })

            const choice = result.choices[0]
            const value = choice.message.content

            return value
        } catch (err: any) {
            // This only ever happens if the API request fails because of Bad Request or exceptional circumstances (e.g. API down)
            throw new GenerationError(
                'Failed to generate response'
            ).withContext(err)
        }
    }
}

type OpenAIMeta = {
    usage?: {
        completion: number
        prompt: number
        total: number
    }
}
