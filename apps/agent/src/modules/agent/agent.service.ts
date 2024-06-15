import { Inject, Injectable } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import { nanoid } from 'nanoid'
import { Runner as IRunner } from '@webwisp/types'

import { BrowserService } from '../../services/browser'
import { MindService } from '../../services/mind'
import Runner from '../../services/runner'

@Injectable()
export default class AgentService {
    private readonly logger: Logger
    private readonly runners: Runner[] = []

    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) logger: Logger,
        private readonly browserService: BrowserService,
        private readonly mindService: MindService
    ) {
        this.logger = logger.child({
            context: 'AgentService',
        })
    }

    getRunners(): Readonly<IRunner>[] {
        return this.runners.map<Readonly<IRunner>>(Object.freeze)
    }

    getRunner(id: number): Readonly<IRunner> | undefined {
        const runner = this.runners.find((runner) => runner.id === id)
        return runner ? Object.freeze(runner) : undefined
    }

    async spawn(target: string, prompt: string): Promise<Runner> {
        this.logger.info(
            `Spawning runner for task: ${prompt} on target: ${target}`
        )

        const context = await this.browserService.detach()
        const page = await context?.detach(target)

        if (!page) {
            this.logger.error('Failed to create page for runner')
            throw new Error('Failed to create page for runner')
        }

        const runner = new Runner(
            this.runners.length + 1,
            nanoid(),
            {
                target,
                prompt,
            },
            page,
            this.mindService,
            this.logger
        )

        this.runners.push(runner)

        return runner
    }
}
