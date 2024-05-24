import { Runner } from './Runner'
import { Agent } from '../Agent'
import { Page } from 'playwright'
import { OpenAIService } from '../../services/OpenAI.service'
import { Logger } from 'pino'
import { useConfig } from '../../hooks'
import { PromptsTransformer } from '../../transformers/Prompts.transformer'
import OpenAI from 'openai'
import { PlaywrightService } from '../../services/Playwright.service'

export class RunnerTask extends Runner {
    private actions: string[] = []

    constructor(
        agent: Agent,
        target: string,
        page: Page,
        openai: OpenAIService,
        pw: PlaywrightService,
        logger: Logger,
        private readonly task: string,
    ) {
        super(agent, target, page, openai, pw, logger)
    }

    async launch() {
        this.logger.debug('Starting...')

        const config = useConfig()

        let cycles = 0
        let failed_cycles = 0

        while (cycles < config.api.max_cycles && failed_cycles < config.api.max_failed_cycles) {
            this.logger.info(`Cycle ${cycles}`)

            const prompt = PromptsTransformer.transformTaskUserPrompt({
                url: this.page.url(),
                title: await this.page.title(),
                task: this.task,
                actions: this.actions,
            })

            const screenshot = await this.screenshot()

            const messages: OpenAI.ChatCompletionMessageParam[] = [
                {
                    role: 'system',
                    content: PromptsTransformer.transformTaskSystemPrompt(),
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
                                detail: 'auto',
                            },
                        },
                    ],
                },
            ]

            const result = await this.openai.completion(
                messages,
            )

            const choice = result.choices[0]
            const message = choice.message.content

            if (!message) {
                this.logger.error('No message returned from OpenAI')
                break
            }

            this.logger.info(message)

            const action = this.parseAction(message)
            if (action.type === 'done') {
                this.logger.info('Task completed')
                break
            } else if (action.type === 'fail') {
                this.logger.error('Task failed')
                break
            }

            const actionResult = await this.handleAction(action)
            this.actions.push(actionResult.unwrapUnchecked())

            this.logger.info({
                usage: result.usage,
                finish_reason: choice.finish_reason,
            }, `Cycle ${cycles} finished`)

            if (actionResult.isErr())
                failed_cycles++
            cycles++

            await this.sleep(config.api.delay)
        }

        if (failed_cycles >= config.api.max_failed_cycles) {
            this.logger.error('Task failed, reached maximum failed cycles')
        } else if (cycles >= config.api.max_cycles) {
            this.logger.error('Task failed, reached maximum cycles')
        }

        this.logger.debug('Finished')
    }
}