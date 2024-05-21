import { OpenAIService } from '../services/OpenAI.service'
import { PlaywrightService } from '../services/Playwright.service'
import { Service } from '../domain/Service'

import pino, { Logger } from 'pino'
import { useConfig, usePrompts } from '../hooks'
import { PromptsTransformer } from '../transformers/Prompts.transformer'
import OpenAI from 'openai'
import { Runner } from './Runner'


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

    async run() {
        this.debug('Running agent')

        const config = useConfig()

        const page = await this.pw.make_page(config.target)
        const steps = config.tasks?.at(0)?.scenario[0] as string[]

        const runner = new Runner(this, config.target, steps, page, this.openai, this.logger.child({
            runner: 0,
        }))

        await runner.run()

        await page.destroy()

        this.debug('Agent finished')
    }
}