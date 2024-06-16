import Message from '../domain/Message'

export default abstract class MindMapper {
    abstract message: MindMessageMapper<unknown>
}

export abstract class MindMessageMapper<ModelMessage> {
    abstract toDomains(messages: ModelMessage[]): Message[]
    abstract toDomain(message: ModelMessage): Message
    abstract toModels(messages: Message[]): ModelMessage[]
    abstract toModel(message: Message): ModelMessage
}
