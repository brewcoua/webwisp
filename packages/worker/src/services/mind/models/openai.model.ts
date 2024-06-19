import OpenAI from 'openai'

import MindModel from './mind.model'
import Message from '../domain/Message'
import OpenAIMapper from '../mappers/openai.mapper'

import config from '../mind.config'
import { GenerationError } from '../mind.errors'
import ModelStatus from '../domain/ModelStatus'

export default class OpenAIModel extends MindModel<OpenAI> {
    protected readonly client: OpenAI
    protected readonly mapper: OpenAIMapper

    constructor() {
        super('OpenAI')

        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OPENAI_API_KEY is not set')
        }

        this.client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            organization: process.env.OPENAI_ORG,
            project: process.env.OPENAI_PROJECT,
        })
        this.mapper = new OpenAIMapper()
    }

    public async verify(): Promise<ModelStatus> {
        try {
            const list = await this.client.models.list()

            const isModelAvailable = list.data.some(
                (model) => model.id === config.options.model
            )

            if (!isModelAvailable) {
                return ModelStatus.MISSING_MODEL
            }
            return ModelStatus.READY
        } catch (err: any) {
            // This only ever happens if the API request fails because of Bad Request or exceptional circumstances (e.g. API down)
            return ModelStatus.UNAUTHORIZED(err)
        }
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
            throw new GenerationError('Failed to generate response')
        }
    }
}
