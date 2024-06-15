import { Injectable, Logger } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { RunEvents, Runner, RunnerStatus } from '@webwisp/types'

import AgentService from '../agent/agent.service'

@Injectable()
export default class RunsService {
    constructor(
        private eventEmitter: EventEmitter2,
        private agentService: AgentService
    ) {}

    async createRun(target: string, prompt: string): Promise<Runner> {
        Logger.log(`Creating run for target: ${target}`, 'RunsService')
        const runner = await this.agentService.spawnRunner(target, prompt)

        const runnerObj: Runner = {
            id: runner.id,
            name: "temp",
            status: RunnerStatus.STARTING,
            createdAt: new Date(),
            config: {
                target: target,
                prompt: prompt,
            },
            actions: [],
        }

        this.eventEmitter.emit(`run.${runner.id}`, {
            type: RunEvents.RUNNER_CREATED,
            runner: runnerObj,
        })

        return runnerObj
    }
}
