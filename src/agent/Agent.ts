import Logger from '@/logger'
import OpenAIService from '@/services/OpenAIService'
import PlaywrightService from '@/services/PlaywrightService'
import Service from '@/domain/Service'

import Runner from './Runner'

export default class Agent extends Service {
    private openai!: OpenAIService
    private pw!: PlaywrightService

    constructor() {
        super('agent')
    }

    async initialize() {
        Logger.debug('Initializing agent')

        this.openai = new OpenAIService()
        this.pw = new PlaywrightService()

        await Promise.all([this.openai.initialize(), this.pw.initialize()])

        Logger.debug('Agent initialized')
    }

    async destroy() {
        Logger.debug('Destroying agent')

        await Promise.allSettled([this.openai.destroy(), this.pw.destroy()])

        Logger.debug('Agent destroyed')
    }

    async spawn_task(target: string, task: string) {
        Logger.debug('Running agent')

        const page = await this.pw.make_page(target)

        const runner = new Runner(page, this.openai, task)

        await runner.initialize()

        return runner.launch()
    }
}
