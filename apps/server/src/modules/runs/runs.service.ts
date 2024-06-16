import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { RunEvents } from '@webwisp/types'

import AgentService from '../agent/agent.service'
import Runner from '../../services/runner/runner.service'
import RunnerEntity from './entities/runner.entity'

@Injectable()
export default class RunsService {
    constructor(
        private eventEmitter: EventEmitter2,
        private agentService: AgentService
    ) {}

    getRuns() {
        return this.agentService
            .getRunners()
            .map((runner) => new RunnerEntity(runner))
    }

    getRun(id: number) {
        const runner = this.agentService.getRunner(id)
        return runner ? new RunnerEntity(runner) : undefined
    }

    async createRun(target: string, prompt: string): Promise<Runner> {
        const runner = await this.agentService.spawn(target, prompt)

        Object.values(RunEvents).forEach((event) => {
            runner.on(event, (data) => {
                this.eventEmitter.emit(`run.${runner.id}`, {
                    type: event,
                    data,
                })
            })
        })

        //void runner.run()

        return runner
    }
}
