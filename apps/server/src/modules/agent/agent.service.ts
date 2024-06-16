import { Injectable, Logger } from '@nestjs/common'
import { nanoid } from 'nanoid'
import { Runner as IRunner } from '@webwisp/types'

import { BrowserService } from '../../services/browser'
import { MindService } from '../../services/mind'
import Runner from '../../services/runner'
import { Contexts } from '../../constants'

@Injectable()
export default class AgentService {
    private readonly runners: Runner[] = []

    constructor(
        private readonly browserService: BrowserService,
        private readonly mindService: MindService
    ) {}

    getRunners(): Readonly<IRunner>[] {
        return this.runners.map<Readonly<IRunner>>(Object.freeze)
    }

    getRunner(id: number): Readonly<IRunner> | undefined {
        const runner = this.runners.find((runner) => runner.id === id)
        return runner ? Object.freeze(runner) : undefined
    }

    async spawn(target: string, prompt: string): Promise<Runner> {
        Logger.log(
            `Spawning runner for task: ${prompt} on target: ${target}`,
            Contexts.AgentService
        )

        const page = await this.browserService.detach(target)
        const runner = new Runner(
            this.runners.length + 1,
            nanoid(),
            {
                target,
                prompt,
            },
            page,
            this.mindService
        )

        this.runners.push(runner)

        return runner
    }
}
