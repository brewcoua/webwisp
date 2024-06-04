import { useConfig } from '../constants'
import { Action, CalledAction } from '../domain/config'
import { readFileSync } from 'fs'
import OpenAI from 'openai'

export default class PromptBuilder {
    public static makeSystem(): OpenAI.ChatCompletionMessageParam[] {
        const systemPrompt = useConfig().prompts.system

        const actions = useConfig().actions
        const actionList = Object.keys(actions)
            .map((action) => {
                const info: Action = actions[action]

                const args = Object.keys(info.arguments || {})
                    .map((argName) => {
                        const arg = (info.arguments || {})[argName]

                        return `${arg.required ? '<' : '['}${arg.name};${arg.type}${
                            arg.enum ? `;${arg.enum.join('|')}` : ''
                        }${arg.required ? '>' : ']'}`
                    })
                    .join(' ')

                return `- ${action} ${args} : ${info.description}`
            })
            .join('\n')

        const examples = (systemPrompt.examples.list || []).map(
            (example): OpenAI.ChatCompletionMessageParam[] => {
                const screenshotBuf = readFileSync(example.screenshot, {
                    encoding: 'base64',
                })

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
            }
        )

        return [
            {
                role: 'system',
                content:
                    systemPrompt.introduction.replace(
                        '{{actions}}',
                        actionList
                    ) +
                    (systemPrompt.examples.list
                        ? '\n' + systemPrompt.examples.message
                        : ''),
            },
            ...examples.flat(),
        ]
    }

    public static makeUser(
        args: UserPromptPlaceholders
    ): OpenAI.ChatCompletionMessageParam {
        const prompt = useConfig()
            .prompts.user.prompt.replace('{{title}}', args.title)
            .replace('{{url}}', args.url)
            .replace('{{task}}', args.task)
            .replace(
                '{{previous_actions}}',
                args.previous_actions
                    .map((action) => {
                        return `- ${action.type} ${Object.keys(action.arguments)
                            .map((arg) => {
                                const value = action.arguments[arg]
                                return typeof value === 'string'
                                    ? `"${value}"`
                                    : value
                            })
                            .join(' ')} : ${action.description} ${
                            action.status ? `(${action.status})` : ''
                        }`
                    })
                    .join('\n')
            )

        return {
            role: 'user',
            content: [
                {
                    type: 'text',
                    text: prompt,
                },
                {
                    type: 'image_url',
                    image_url: {
                        url: args.screenshot,
                        detail: 'auto',
                    },
                },
            ],
        }
    }
}

export type UserPromptPlaceholders = {
    title: string
    url: string
    task: string
    previous_actions: CalledAction[]
    screenshot: `data:image/${string};base64,${string}`
}
