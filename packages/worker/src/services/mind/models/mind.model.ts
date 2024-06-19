import MindMapper from '../mappers/mind.mapper'
import type Message from '../domain/Message'
import ModelStatus from '../domain/ModelStatus'

export default abstract class MindModel<Client> {
    protected abstract readonly client: Client
    protected abstract readonly mapper: MindMapper

    constructor(protected readonly name: string) {}

    /**
     * Verify the validity of the authentication and model setup
     * @returns Whether everything is set up correctly
     */
    abstract verify(): Promise<ModelStatus>

    /**
     * Generate a response from a list of messages
     * @param messages - Messages to generate a response from
     * @returns The generated response
     */
    abstract generate(messages: Message[]): Promise<string | null>
}
