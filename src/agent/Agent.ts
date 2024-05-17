import { OpenAIService } from '../services/OpenAI.service'
import { PlaywrightService } from '../services/Playwright.service'
import { Service } from '../domain/Service'

import pino, { Logger } from 'pino'
import { useConfig, usePrompts } from '../hooks'
import { RunStreamHandler } from './events'
import { PromptsTransformer } from '../transformers/Prompts.transformer'
import OpenAI from 'openai'
import { CompletionStreamData, CompletionStreamEvent, CompletionStreamHandler } from './Stream'

export class Agent extends Service {
    private openai!: OpenAIService
    private pw!: PlaywrightService

    constructor() {
        super(
            pino({
                level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
            }).child({ service: 'agent' }),
            'agent',
        )
    }

    async initialize() {
        this.debug('Initializing agent')

        this.openai = new OpenAIService(this.logger)
        this.pw = new PlaywrightService(this.logger)

        await Promise.all([
            this.openai.initialize(),
            this.pw.initialize(),
        ])

        this.debug('Agent initialized')
    }

    async destroy() {
        this.debug('Destroying agent')

        await Promise.all([
            this.openai.destroy(),
            this.pw.destroy(),
        ])

        this.debug('Agent destroyed')
    }

    async sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    async run() {
        this.debug('Running agent')

        const config = useConfig()

        const pageId = await this.pw.make_page(config.target)

        const steps = config.tasks?.at(0)?.scenario[0] as string[]
        let currentStep = 0

        while (currentStep < steps.length) {
            this.info(`Step ${currentStep}: ${steps[currentStep]}`)

            const url = await this.pw.url(pageId)

            const prompt = PromptsTransformer.transformUserPrompt({
                currentStep,
                steps,
                url,
            })

            const screenshot = await this.pw.screenshot(pageId)

            const messages: OpenAI.ChatCompletionMessageParam[] = [
                {
                    role: 'system',
                    content: usePrompts().system.join('\n'),
                },
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: prompt,
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                url: screenshot,
                                detail: 'low',
                            },
                        },
                    ],
                },
            ]

            const total_result: {
                usage: OpenAI.CompletionUsage,
                message: string,
                reason: string,
            } = {
                usage: {
                    completion_tokens: 0,
                    prompt_tokens: 0,
                    total_tokens: 0,
                },
                message: '',
                reason: '',
            }

            let cycles = 0;
            while (true) {
                const handler = new CompletionStreamHandler(this.pw, pageId)
                const stream = await this.openai.stream_completion(messages, usePrompts().tools, 'required')
                cycles++;
                this.debug(`Stream completion started (${cycles}/${config.api.max_cycles})`)

                const results: [CompletionStreamData, void] = await Promise.all([
                    new Promise<CompletionStreamData>((resolve) => {
                        handler.once(CompletionStreamEvent.Completed, resolve)
                    }),
                    new Promise<void>(async (resolve) => {
                        for await (const chunk of stream) {
                            handler.emit(CompletionStreamEvent.Chunk, chunk);
                        }
                        resolve();
                    })
                ])

                const result = results[0]
                this.debug({
                    result,
                }, 'Result for stream')

                if (result.usage) {
                    total_result.usage.completion_tokens += result.usage.completion_tokens;
                    total_result.usage.prompt_tokens += result.usage.prompt_tokens;
                    total_result.usage.total_tokens += result.usage.total_tokens;
                }
                if (result.reason) {
                    total_result.reason = result.reason;
                }

                if (result.message) {
                    total_result.message += result.message;
                }

                if (result.tool_outputs) {
                    messages.push(...result.tool_outputs);
                } else {
                    break;
                }

                if (config.api.max_cycles && cycles >= config.api.max_cycles) {
                    throw new Error('Max cycles reached, stopping');
                }
            }

            this.debug({
                total_result,
            }, 'Total result for step')

            currentStep++
            await this.sleep(config.api.delay)
        }
    }
}