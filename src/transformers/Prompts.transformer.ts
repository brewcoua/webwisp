import { usePrompts } from '../hooks'

export class PromptsTransformer {
    public static transformTaskSystemPrompt() {
        return usePrompts().system.join('\n');
    }

    public static transformTaskUserPrompt(placeholders: UserPromptTaskPlaceholders) {
        return usePrompts().user.join('\n')
            .replace('%%URL%%', placeholders.url)
            .replace('%%TITLE%%', placeholders.title)
            .replace('%%TASK%%', placeholders.task)
            .replace('%%ACTIONS%%', placeholders.actions.join('\n'))
    }
}

export type UserPromptTaskPlaceholders = {
    url: string;
    title: string;
    task: string;
    actions: string[];
}