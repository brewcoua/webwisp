import OpenAI from 'openai'

import WebwispError from '@/domain/errors/Error'

import MindModel from './MindModel'
import GenerationResponse from '../domain/GenerationResponse'
import Message from '../domain/Message'
import OpenAIMapper from '../mappers/OpenAIMapper'

import config from '../MindConfig'

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

    public async generate(
        messages: Message[]
    ): Promise<GenerationResponse<OpenAIMeta>> {
        const modelMessages = this.mapper.message.toModels(messages)

        const result = await this.client.chat.completions.create({
            model: config.options.model,
            messages: modelMessages,
            temperature: config.options.temperature,
            max_tokens: config.options.max_tokens,
        })

        const choice = result.choices[0]
        const value = choice.message.content

        const usage = result.usage
            ? {
                  completion: result.usage.completion_tokens,
                  prompt: result.usage.prompt_tokens,
                  total: result.usage.total_tokens,
              }
            : undefined

        if (!value) {
            return {
                success: false,
                error: 'No completion value found in OpenAI response',
                meta: {
                    usage,
                },
            }
        }

        return {
            success: true,
            result: value,
            meta: {
                usage,
            },
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
