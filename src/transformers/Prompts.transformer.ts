import { usePrompts } from '../hooks'

export class PromptsTransformer {
    public static transformUserPrompt(placeholders: UserPromptPlaceholders) {
        const prompt = usePrompts().user.join('\n');
        const formattedSteps = placeholders.steps.map((step, index) => {
            if (index === placeholders.currentStep) {
                return `${index + 1}. ++${step}++`;
            }
            return `${index + 1}. ${step}`;
        }).join('\n');

        return prompt
            .replace('%%STEPS%%', formattedSteps)
            .replace('%%URL%%', placeholders.url);
    }
}

export type UserPromptPlaceholders = {
    currentStep: number;
    steps: string[];
    url: string;
}