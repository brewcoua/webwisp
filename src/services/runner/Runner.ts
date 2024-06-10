import Logger from '@/logger'
import PageWrapper from '../browser/wrappers/PageWrapper'
import MindService from '../mind'
import Message from '../mind/domain/Message'
import config from './RunnerConfig'

import Action from './domain/Action'
import ActionStatus from './domain/ActionStatus'
import TaskResult from './domain/TaskResult'
import ActionType from './domain/ActionType'
import { ErrorResult } from './domain/ErrorResult'
import ParsedResult from '../mind/domain/ParsedResult'
import CycleResult from './domain/CycleResult'

export default class Runner {
    constructor(
        private readonly page: PageWrapper,
        private readonly mind: MindService,
        private readonly task: string
    ) {}

    private cycles = {
        total: 0,
        failed: 0,
        format: 0,
    }
    private readonly actions: Action[] = []

    public async run(): Promise<TaskResult> {
        Logger.debug(`Starting task: ${this.task}`)
        while (
            this.cycles.total < config.cycles.max &&
            this.cycles.failed < config.cycles.failed
        ) {
            const cycleResult = await this.cycle()

            if (!cycleResult.success) {
                this.cycles.failed++
                Logger.warn(`Cycle failed: ${cycleResult.error}`)
            } else {
                this.cycles.total++
                const action = cycleResult.action
                Logger.debug(`Cycle ${this.cycles.total} completed`)

                if (action.type === ActionType.Done) {
                    return {
                        success: action.arguments.status === 'success',
                        message: action.arguments.reason as string,
                        value: action.arguments.value as string | undefined,
                    }
                }
            }

            if (config.delay) await this.sleep(config.delay)
        }

        if (this.cycles.failed >= config.cycles.failed) {
            return {
                success: false,
                message: 'Failed too many times',
            }
        } else {
            return {
                success: false,
                message: 'Reached maximum cycles',
            }
        }
    }

    private async cycle(): Promise<CycleResult | ErrorResult> {
        const startedAt = Date.now()

        await this.page.waitToLoad()

        const screenshot = await this.page.screenshot()
        if (!screenshot)
            return {
                success: false,
                error: 'Failed to take screenshot',
            }

        const title = await this.page.title(),
            url = this.page.url
        if (!title || !url)
            return {
                success: false,
                error: 'Failed to get title or URL',
            }

        const messages = this.mind.transformer.makePrompt({
            user: {
                title,
                url,
                task: this.task,
                previous_actions: this.actions,
                screenshot,
            },
        })

        this.cycles.format = 0

        let result: ParsedResult | null = null
        while (this.cycles.format < config.cycles.format && !result) {
            const genResult = await this.formatCycle(messages)
            if (genResult.success) {
                result = genResult
            } else {
                this.cycles.format++
                Logger.warn(
                    `Failed to format cycle, retrying...\nCaused by: ${genResult.error}`
                )
            }
        }

        if (!result)
            return {
                success: false,
                error: 'Failed to format cycle too many times',
            }

        const status = await this.page.perform(result.action)
        if (status !== ActionStatus.Success) {
            this.cycles.failed++
        }

        result.action.status = status
        this.actions.push(result.action)

        Logger.action(result.action, result.reasoning, Date.now() - startedAt)

        return {
            success: true,
            action: result.action,
        }
    }

    private async formatCycle(
        messages: Message[]
    ): Promise<ParsedResult | ErrorResult> {
        const completion = await this.mind.model.generate(messages)
        if (!completion)
            return {
                success: false,
                error: 'No completion found',
            }

        Logger.debug(`Completion: ${completion}`)

        return this.mind.parser.parse(completion)
    }

    private async sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }
}