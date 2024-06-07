import MindMapper from '../mappers/MindMapper'
import GenerationResponse from '../domain/GenerationResponse'
import type Message from '../domain/Message'

export default abstract class MindModel<Client> {
    protected abstract readonly client: Client
    protected abstract readonly mapper: MindMapper

    constructor(protected readonly name: string) {}

    /**
     * Generate a response from a list of messages
     * @param messages Messages to generate a response from
     */
    abstract generate(messages: Message[]): Promise<GenerationResponse<unknown>>
}
