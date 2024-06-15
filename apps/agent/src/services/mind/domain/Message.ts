export type Message = SystemMessage | UserMessage | AssistantMessage
export default Message

export type MessageRole = 'system' | 'user' | 'assistant'

export type SystemMessage = {
    role: 'system'
    name?: string
    content: string
}

export type UserMessage = {
    role: 'user'
    name?: string
    content: string | (TextContent | ImageURLContent)[]
}

export type AssistantMessage = {
    role: 'assistant'
    name?: string
    content: string
}

export type TextContent = {
    type: 'text'
    text: string
}
export type ImageURLContent = {
    type: 'image_url'
    image_url: {
        url: string
        detail?: 'auto' | 'low' | 'high'
    }
}
