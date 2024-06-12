import { Logger, createLogger, format, transports } from 'winston'

import Service from '@/domain/Service'

import { BrowserService, MindService, Runner } from './services'
import { TTYFormat } from './config/logger'
import WebwispError from './domain/WebwispError'

export default class Agent extends Service {
    private mind!: MindService
    private browser!: BrowserService
    private readonly runners: Runner[] = []

    constructor(logger?: Logger) {
        super(
            'Agent',
            logger ||
                createLogger({
                    transports: [
                        new transports.Console({
                            format: process.stdout.isTTY
                                ? format.combine(format.timestamp(), TTYFormat)
                                : format.json(),
                        }),
                        new transports.File({
                            filename: `${process.cwd()}/logs/${Date.now()}.log`,
                        }),
                    ],
                })
        )
    }

    public get _logger(): Logger {
        return this.logger
    }

    async initialize() {
        this.logger.debug('Agent initializing')

        this.mind = new MindService(this.logger)
        this.browser = new BrowserService(this.logger)

        await Promise.all([this.mind.initialize(), this.browser.initialize()])

        this.logger.debug('Agent initialized')
    }

    async destroy() {
        this.logger.debug('Destroying agent')

        await Promise.allSettled([this.mind.destroy(), this.browser.destroy()])

        this.logger.debug('Agent destroyed')
    }

    async spawn(target: string, task: string): Promise<Runner> {
        this.logger.debug(
            `Spawning runner for task: ${task} on target: ${target}`
        )

        const context = await this.browser.newContext()
        const page = await context?.makePage(target)

        if (!page) {
            throw new WebwispError('Failed to create page')
        }

        const runner = new Runner(
            page,
            this.mind,
            task,
            this.runners.length + 1,
            this.logger
        )

        this.runners.push(runner)

        return runner
    }
}
