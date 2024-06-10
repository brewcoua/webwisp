const config: MindConfig = {
    type: 'openai',
    options: {
        model: 'gpt-4o',
        temperature: 0.3,
        max_tokens: 4000,
    },
} satisfies Partial<MindConfig> & { type: MindModelType }

export default config

/**
 * Configuration for the mind service
 */
export type MindConfig = BasicMindConfig & OpenAIConfig

/**
 * Model-agnostic part of the mind configuration
 */
export type BasicMindConfig = {
    /** Hard ratelimit for the model API, in requests per second */
    ratelimit?: number
}

/**
 * Kinds of model services that can be used (e.g. OpenAI)
 */
export type MindModelType = 'openai'

/**
 * Configuration specific to OpenAI models
 */
export type OpenAIConfig = {
    type: 'openai'
    options: {
        /** Multimodal model to use from OpenAI */
        model: OpenAIModel
        /**
         * Temperature to use for completions. A lower value reduces randomness, while a higher value increases randomness.
         * Between 0 and 2.0. Defaults to 1.
         */
        temperature: number
        /**
         * Maximum number of tokens to generate in the completion. Use at least 2000 for best results.
         */
        max_tokens: number
    }
}
export type OpenAIModel = 'gpt-4o'
