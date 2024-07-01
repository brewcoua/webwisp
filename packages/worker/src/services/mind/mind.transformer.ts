import { readFileSync } from 'node:fs'
import { join as joinPath } from 'node:path'

import config from '@services/execution/execution.config'
import prompts, {
    MindPromptPlaceholders,
    MindPromptUserPlaceholders,
    PromptExample,
} from './mind.prompts'
import Message from './domain/Message'
import { Action, ActionType } from '@domain/action.types'
import { AbstractAction } from '@domain/action.abstract-types'

export default class MindTransformer {
    public makePrompt(placeholders: MindPromptPlaceholders): Message[] {
        return [
            ...this.makeSystemPrompt(),
            ...this.makeUserPrompt(placeholders.user),
        ]
    }

    private makeSystemPrompt(): Message[] {
        const prompt = prompts.system
        const actions = config.actions

        return [
            {
                role: 'system',
                content:
                    this.fillPlaceholders(prompt.introduction, {
                        actions: Object.entries(actions)
                            .map(([type, action]) =>
                                this.mapAbstractAction(
                                    type as ActionType,
                                    action
                                )
                            )
                            .join('\n'),
                    }) +
                    '\n\n' +
                    prompt.addons.examples.message,
            },
            ...this.makeExamplePrompts(prompt.addons.examples.list),
        ]
    }

    private makeUserPrompt(
        placeholders: MindPromptUserPlaceholders
    ): Message[] {
        const prompt = prompts.user

        return [
            {
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: this.fillPlaceholders(prompt.prompt, {
                            title: placeholders.title,
                            url: placeholders.url,
                            task: placeholders.task,
                            previous_actions: placeholders.previous_cycles
                                .map((cycle) => this.mapAction(cycle.action))
                                .join('\n'),
                        }),
                    },
                    {
                        type: 'image_url',
                        image_url: {
                            url: placeholders.screenshot,
                            detail: 'auto',
                        },
                    },
                ],
            },
        ]
    }

    private fillPlaceholders(
        prompt: string,
        placeholders: Record<string, string>
    ): string {
        return Object.entries(placeholders).reduce((acc, [key, value]) => {
            return acc.replace(new RegExp(`{{${key}}}`, 'g'), value)
        }, prompt)
    }

    private mapAction(action: Action) {
        return `- ${action.type} ${Object.keys(action.arguments)
            .map((arg) => {
                const value = action.arguments[arg]
                return typeof value === 'string' ? `"${value}"` : value
            })
            .join(' ')} : ${action.description} ${
            action.status ? `(${action.status})` : ''
        }`
    }

    private mapAbstractAction(
        type: ActionType,
        action: AbstractAction
    ): string {
        const args = (action.arguments || [])
            .map((arg) => {
                const brackets = [
                    arg.required ? '<' : '[',
                    arg.required ? '>' : ']',
                ]
                return `${brackets[0]}${arg.name};${arg.type}${
                    arg.enum ? `;${arg.enum.join('|')}` : ''
                }${brackets[1]}`
            })
            .join(' ')

        return `- ${type} ${args} : ${action.description}\n\te.g. \`${action.example}\``
    }

    private makeExamplePrompts(examples: PromptExample[]): Message[] {
        return examples.flatMap((example) => {
            const screenshotBuf = readFileSync(
                joinPath(__dirname, example.screenshot),
                {
                    encoding: 'base64',
                }
            )

            return [
                {
                    role: 'user',
                    name: 'example_user',
                    content: [
                        {
                            type: 'text',
                            text: example.prompt,
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                url: `data:image/${example.screenshot
                                    .split('.')
                                    .pop()};base64,${screenshotBuf}`,
                                detail: 'auto',
                            },
                        },
                    ],
                },
                {
                    role: 'assistant',
                    name: 'example_assistant',
                    content: example.completion,
                },
            ]
        })
    }
}
