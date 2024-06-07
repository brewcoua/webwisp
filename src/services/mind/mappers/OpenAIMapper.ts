import OpenAI from 'openai'

import MindMapper, { MindMessageMapper } from './MindMapper'
import Message from '../domain/Message'
import WebwispError from '@/domain/errors/Error'

export default class OpenAIMapper extends MindMapper {
    public readonly message = new OpenAIMessageMapper()
}

export type OpenAIMessage =
    | OpenAI.ChatCompletionSystemMessageParam
    | OpenAI.ChatCompletionUserMessageParam
    | OpenAI.ChatCompletionAssistantMessageParam

export class OpenAIMessageMapper extends MindMessageMapper<OpenAIMessage> {
    public toDomains(messages: OpenAIMessage[]): Message[] {
        return messages.map(this.toDomain)
    }

    public toDomain(message: OpenAIMessage): Message {
        if (message.role === 'assistant' || message.role === 'system') {
            if (typeof message.content !== 'string') {
                throw new WebwispError('Invalid message content')
            }

            return {
                role: message.role,
                content: message.content,
            }
        }

        return {
            role: message.role,
            content: message.content,
        }
    }

    public toModels(messages: Message[]): OpenAIMessage[] {
        return messages.map(this.toModel)
    }

    public toModel(message: Message): OpenAIMessage {
        if (message.role === 'assistant' || message.role === 'system') {
            return {
                role: message.role,
                content: message.content,
            }
        }

        return {
            role: message.role,
            content: message.content,
        }
    }
}
