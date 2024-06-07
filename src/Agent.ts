import Logger from '@/logger'
import Service from '@/domain/Service'

import { BrowserService, MindService, Runner } from './services'
import TaskResult from './services/runner/domain/TaskResult'

export default class Agent extends Service {
    private mind!: MindService
    private browser!: BrowserService

    constructor() {
        super('Agent')
    }

    async initialize() {
        Logger.debug('Initializing agent')

        this.mind = new MindService()
        this.browser = new BrowserService()

        await Promise.all([this.mind.initialize(), this.browser.initialize()])

        Logger.debug('Agent initialized')
    }

    async destroy() {
        Logger.debug('Destroying agent')

        await Promise.allSettled([this.mind.destroy(), this.browser.destroy()])

        Logger.debug('Agent destroyed')
    }

    async spawn(target: string, task: string): Promise<TaskResult> {
        Logger.debug('Running agent')

        const context = await this.browser.newContext()
        const page = await context?.makePage(target)

        if (!page) {
            throw new Error('Failed to create page')
        }

        const runner = new Runner(page, this.mind, task)

        return runner.run()
    }
}
