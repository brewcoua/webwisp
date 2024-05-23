import { OpenAIService } from '../services/OpenAI.service'
import { PlaywrightService } from '../services/Playwright.service'
import { Service } from '../domain/Service'

import pino from 'pino'
import { useConfig } from '../hooks'
import { input } from '@inquirer/prompts'
import { RunnerTask } from './runner/RunnerTask'


export class Agent extends Service {
    private openai!: OpenAIService
    private pw!: PlaywrightService

    constructor() {
        super(
            pino({
                level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
                transport: {
                    target: 'pino-pretty',
                    options: {
                        colorize: true,
                        ignore: 'service,runner'
                    }
                },
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

        let target = config.target;
        if (!target) {
            target = await input({
                message: 'Enter the target URL',
                validate: (input) => {
                    try {
                        new URL(input)
                        return true
                    } catch {
                        return false
                    }
                },
            }) as any;
        }

        let task = config.task;
        if (!task) {
            task = await input({
                message: 'Enter the task',
            })
        }

        const page = await this.pw.make_page(target)

        const runner = new RunnerTask(this, target as string, page, this.openai, this.logger.child({
            runner: 0,
        }), task)

        await runner.initialize()

        await runner.launch()

        this.debug('Agent finished')
    }
}