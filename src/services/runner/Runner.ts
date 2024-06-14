import Service from '../../domain/Service'

import PageWrapper from '../browser/wrappers/PageWrapper'
import MindService from '../mind'
import Message from '../mind/domain/Message'
import config from './RunnerConfig'

import Action from '../../services/runner/domain/Action'
import ActionStatus from './domain/ActionStatus'
import TaskResult from './domain/TaskResult'
import ActionType from './domain/ActionType'
import { ErrorResult } from './domain/ErrorResult'
import ParsedResult from '../mind/domain/ParsedResult'
import CycleResult from './domain/CycleResult'
import { Logger } from 'winston'
import ActionReport from './domain/ActionReport'
import RunnerStatus from './domain/RunnerStatus'

/**
 * The Runner class provides a high-level interface for interacting with runners.
 * @public
 */
export default class Runner extends Service {
    constructor(
        public readonly page: PageWrapper,
        public readonly mind: MindService,
        public readonly task: string,
        public readonly id: number,
        logger: Logger
    ) {
        super('Runner', logger.child({ id }))
    }

    private cycles = {
        total: 0,
        failed: 0,
        format: 0,
    }
    private readonly actions: Action[] = []

    private _status: RunnerStatus = 'starting'
    public get status(): RunnerStatus {
        return this._status
    }
    public set status(value: RunnerStatus) {
        this._status = value
        super.emit('status', value)
    }

    public async run(): Promise<TaskResult> {
        this.logger.debug(`Starting task: ${this.task}`)

        this.status = 'running'

        while (
            this.cycles.total < config.cycles.max &&
            this.cycles.failed < config.cycles.failed
        ) {
            const cycleResult = await this.cycle()

            if (!cycleResult.success) {
                this.cycles.failed++
                this.logger.warn(`Cycle failed: ${cycleResult.error}`)
            } else {
                this.cycles.total++
                const action = cycleResult.action
                this.logger.debug(`Cycle ${this.cycles.total} completed`)

                if (action.type === ActionType.Done) {
                    this.status =
                        action.arguments.status === 'success'
                            ? 'done'
                            : 'failed'

                    return {
                        success: action.arguments.status === 'success',
                        message: action.arguments.reason as string,
                        value: action.arguments.value as string | undefined,
                    }
                }
            }

            if (config.delay) await this.sleep(config.delay)
        }

        this.status = 'failed'

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
                this.logger.warn('Failed to format cycle, retrying...', {
                    cycle: {
                        current: this.cycles.format,
                        max: config.cycles.format,
                    },
                    error: genResult.error,
                })
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

        const report: ActionReport = {
            action: result.action,
            reasoning: result.reasoning,
            duration: Date.now() - startedAt,
        }

        this.logger.info('Performed action', report)

        super.emit('action', report)

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

        this.logger.debug('Received completion', completion)

        return this.mind.parser.parse(completion)
    }

    private async sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    public on_action(
        event: 'action',
        listener: (action: ActionReport) => void
    ): this {
        return super.on(event, listener)
    }
    public on_status(
        event: 'status',
        listener: (status: RunnerStatus) => void
    ): this {
        return super.on(event, listener)
    }
    public off_action(
        event: 'action',
        listener: (action: ActionReport) => void
    ): this {
        return super.off(event, listener)
    }
    public off_status(
        event: 'status',
        listener: (status: RunnerStatus) => void
    ): this {
        return super.off(event, listener)
    }
}
