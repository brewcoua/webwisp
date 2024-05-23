import { useConfig, usePrompts } from '../hooks'
import merge from 'deepmerge'

export class PromptsTransformer {
    public static transformTaskSystemPrompt() {
        const config = useConfig()
        const prompts = usePrompts()

        return prompts.prompts.task.system.join('\n')
            .concat(
                config.methods.flatMap(method => prompts.per_method[method]
                    .system || [],
                ).join('\n'),
            )
    }

    public static transformTaskUserPrompt(placeholders: UserPromptTaskPlaceholders) {
        return usePrompts().prompts.task.user.join('\n')
            .replace('%%URL%%', placeholders.url)
            .replace('%%TITLE%%', placeholders.title)
            .replace('%%TASK%%', placeholders.task)
            .replace('%%ACTIONS%%', placeholders.actions.join('\n'))
    }

    public static transformUserPrompt(placeholders: UserPromptStepsPlaceholders) {
        const config = useConfig()
        const prompts = usePrompts()

        const prompt = prompts.prompts.steps.user.join('\n')
        const formattedSteps = placeholders.steps.map((step, index) => {
            if (index === placeholders.currentStep) {
                return `${index + 1}. ++${step}++`
            }
            return `${index + 1}. ${step}`
        }).join('\n')

        return prompt
            .replace('%%STEPS%%', formattedSteps)
            .replace('%%URL%%', placeholders.url)
            .concat(
                config.methods.flatMap(method => prompts.per_method[method]
                    .user || [],
                ).join('\n'),
            )
    }

    public static transformTools() {
        const prompts = usePrompts()
        const config = useConfig()

        let globalTools = prompts.tools
        config.methods.forEach(method => {
            const tools = prompts.per_method[method].tools;
            if (tools) {
                for (let i = 0; i < tools.length; i++) {
                    const tool = tools[i]
                    globalTools[i] = merge(globalTools[i], tool)
                }
            }
        })

        return globalTools;
    }
}

export type UserPromptTaskPlaceholders = {
    url: string;
    title: string;
    task: string;
    actions: string[];
}

export type UserPromptStepsPlaceholders = {
    currentStep: number;
    steps: string[];
    url: string;
}