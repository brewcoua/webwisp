import { Injectable, Logger } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { RunEvents } from '@webwisp/types'
import { nanoid } from 'nanoid'

import { PageWrapper } from '../../services/browser/wrappers'
import { REMOTE_PORT } from '../../services/browser/browser.config'
import { BrowserService } from '../../services/browser'
import { MindService } from '../../services/mind'
import Runner from '../../services/runner/runner.service'
import { Contexts } from '../../constants'

import RunnerEntity from './entities/runner.entity'
import PartialRunnerEntity from './entities/partial-runner.entity'

@Injectable()
export default class RunsService {
    private readonly runners: Map<string, Runner> = new Map()

    constructor(
        private readonly eventEmitter: EventEmitter2,
        private readonly browserService: BrowserService,
        private readonly mindService: MindService
    ) {}

    getAll(): PartialRunnerEntity[] {
        return Array.from(this.runners.values()).map(
            (runner) => new PartialRunnerEntity(runner)
        )
    }

    get(id: string) {
        const runner = this.runners.get(id)
        return runner && new RunnerEntity(runner)
    }

    async spawn(target: string, prompt: string): Promise<RunnerEntity> {
        Logger.log(
            `Spawning runner on target: ${target}, prompt: "${prompt}"`,
            Contexts.RunsService
        )

        const page = await this.browserService.detach(target)
        const pageId = await this.findPageId(page)

        const runner = new Runner(
            nanoid(),
            pageId,
            { target, prompt },
            page,
            this.mindService
        )

        this.runners.set(runner.id, runner)

        Object.values(RunEvents).forEach((event) => {
            runner.on(event, (data) => {
                this.eventEmitter.emit(`run.${runner.id}`, {
                    type: event,
                    data,
                })
            })
        })

        return new RunnerEntity(runner)
    }

    private async findPageId(page: PageWrapper): Promise<string> {
        const url = page.url,
            title = await page.title()

        const pages = (await fetch(`http://localhost:${REMOTE_PORT}/json`)
            .then((res) => res.json())
            .catch(() => [])) as any[]

        const remotePage = pages.find((p: any) => {
            if (p.type !== 'page' || p.url !== url || p.title !== title) {
                return false
            }

            // Ignore page if any current runner already has it
            return !Array.from(this.runners.values()).some(
                (runner) => runner.pageId === p.id
            )
        })

        if (!remotePage) {
            Logger.error(
                'Failed to find page in remote debugger',
                Contexts.RunsService
            )
            throw new Error('Failed to find page in remote debugger')
        }

        return remotePage.id
    }

    async start(id: string) {
        return this.runners.get(id)?.run()
    }
    async cancel(id: string) {
        Logger.log(`Cancelling runner: ${id}`, Contexts.RunsService)
        return this.runners.get(id)?.cancel()
    }
    pause(id: string) {
        Logger.log(`Pausing runner: ${id}`, Contexts.RunsService)
        return this.runners.get(id)?.pause()
    }
    resume(id: string) {
        Logger.log(`Resuming runner: ${id}`, Contexts.RunsService)
        return this.runners.get(id)?.resume()
    }
}
