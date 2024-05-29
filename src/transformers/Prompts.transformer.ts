import { PROMPTS } from '../constants'

export class PromptsTransformer {
    public static transformTaskSystemPrompt() {
        return PROMPTS.system
    }

    public static transformTaskUserPrompt(
        placeholders: UserPromptTaskPlaceholders
    ) {
        return PROMPTS.user
            .replace('%%URL%%', placeholders.url)
            .replace('%%TITLE%%', placeholders.title)
            .replace('%%TASK%%', placeholders.task)
            .replace('%%ACTIONS%%', placeholders.actions.join('\n'))
    }
}

export type UserPromptTaskPlaceholders = {
    url: string
    title: string
    task: string
    actions: string[]
}
