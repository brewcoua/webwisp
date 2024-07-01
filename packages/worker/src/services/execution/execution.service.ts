import { Logger } from 'winston'

import WorkerService from 'src/worker.service'

import config from './execution.config'
import { PageWrapper } from '@services/browser/wrappers'
import { TaskEventType } from './domain/task.events'
import {
    CreateTaskProps,
    CycleReport,
    TaskProps,
    TaskStatus,
} from './domain/task.types'
import CycleResult, { CycleStatus } from './domain/cycle.types'
import { ActionStatus, ActionType } from '@domain/action.types'
import { WorkerEventType } from './domain/worker.events'
import { WorkerStatus } from './domain/worker.types'
import { getLoginScript } from '@services/evaluation/scripts'

export default class ExecutionService {
    private readonly logger: Logger

    constructor(
        private readonly worker: WorkerService,
        logger: Logger
    ) {
        this.logger = logger.child({
            context: 'ExecutionService',
        })
        this.worker.rabbitmq.bindTasks((task) => this.listener(task))
    }

    async listener(task: CreateTaskProps) {
        this.logger.info('Received task to execute', { id: task.id })

        await this.worker.browser.getContext().startTracing(task.id)

        const result = await this.execute(task)

        await this.worker.browser.getContext().stopTracing(task.id)

        this.logger.info('Task executed', {
            id: task.id,
            status: result.status,
        })

        this.logger.verbose('Result', result)

        const status = this.worker.rabbitmq.emitTaskEvent({
            type: TaskEventType.COMPLETED,
            id: task.id,
            task: {
                ...result,
                target: task.target,
                prompt: task.prompt,
            },
        })

        this.worker.rabbitmq.emitWorkerEvent({
            type: WorkerEventType.STATUS_CHANGED,
            status: WorkerStatus.READY,
        })

        if (status) {
            this.logger.debug('Published result for task', { id: task.id })
        } else {
            throw new Error('Failed to publish result')
        }
    }

    async execute(
        task: CreateTaskProps
    ): Promise<Omit<TaskProps, 'target' | 'prompt'>> {
        this.logger.verbose('Executing task', { id: task.id })

        this.worker.rabbitmq.emitTaskEvent({
            type: TaskEventType.STARTED,
            id: task.id,
            task: {
                target: task.target,
                prompt: task.prompt,
                status: TaskStatus.RUNNING,
                cycles: [],
            },
        })

        this.worker.rabbitmq.emitWorkerEvent({
            type: WorkerEventType.STATUS_CHANGED,
            status: WorkerStatus.BUSY,
            task: task.id,
        })

        const page = await this.worker.browser.detach(task.target)
        if (!page) {
            return {
                status: TaskStatus.FAILED,
                message: 'Failed to attach to page',
                cycles: [],
            }
        }

        if (task.login_script) {
            this.logger.verbose('Running login script', { id: task.id })
            const script = getLoginScript(task.login_script)
            await script.run(page.unwrap())

            // Go back to the target
            await page.goto(task.target)
            await page.waitToLoad()
        }

        const result = await this.loop(page, task)

        if (task.evaluation) {
            this.logger.verbose('Evaluating task', { id: task.id })
            const results = await this.worker.evaluation.evaluate(
                page,
                task.evaluation
            )

            return {
                status: result.status,
                message: result.message,
                value: result.value,
                cycles: result.cycles,
                evaluation: {
                    results,
                    config: task.evaluation,
                },
            }
        }

        return {
            status: result.status,
            message: result.message,
            value: result.value,
            cycles: result.cycles,
        }
    }

    private async loop(page: PageWrapper, task: CreateTaskProps) {
        const cycles: CycleReport[] = []
        const cycleCounters = {
            total: 0,
            failed: {
                total: 0, // Total failed cycles
                action: 0, // Action fails
                format: 0, // Format is wrong
            },
        }

        while (
            cycleCounters.total < config.cycles.total &&
            cycleCounters.failed.total < config.cycles.failed.total &&
            cycleCounters.failed.action < config.cycles.failed.action &&
            cycleCounters.failed.format < config.cycles.failed.format
        ) {
            const cycleResult = await this.cycle(task, page, cycles)
            cycleCounters.total++

            switch (cycleResult.status) {
                case CycleStatus.SUCCESS: {
                    cycles.push(cycleResult.report)
                    const action = cycleResult.report.action
                    if (action.type === ActionType.DONE) {
                        return {
                            status:
                                action.arguments.status === 'success'
                                    ? TaskStatus.COMPLETED
                                    : TaskStatus.FAILED,
                            message: action.arguments.reason.toString(),
                            value: action.arguments.value as string | undefined,
                            cycles,
                        }
                    }
                    this.logger.verbose('Cycle completed', {
                        id: task.id,
                        cycle: cycleCounters.total,
                        action: action,
                    })
                    this.worker.rabbitmq.emitTaskEvent({
                        type: TaskEventType.CYCLE_COMPLETED,
                        id: task.id,
                        report: cycleResult.report,
                    })
                    break
                }
                case CycleStatus.ACTION_FAILED:
                    cycleCounters.failed.total++
                    cycleCounters.failed.action++
                    cycles.push(cycleResult.report)

                    this.logger.verbose('Cycle action failed', {
                        id: task.id,
                        cycle: cycleCounters.total,
                        failed: cycleCounters.failed,
                        action: cycleResult.report.action,
                    })

                    break
                case CycleStatus.FORMAT_FAILED:
                    cycleCounters.failed.total++
                    cycleCounters.failed.format++

                    this.logger.verbose('Cycle format failed', {
                        id: task.id,
                        cycle: cycleCounters.total,
                        failed: cycleCounters.failed,
                    })

                    break
            }
        }

        let message
        if (cycleCounters.total >= config.cycles.total) {
            message = `Reached maximum cycles (${config.cycles.total})`
        } else if (cycleCounters.failed.total >= config.cycles.failed.total) {
            message = `Reached maximum failed cycles (${config.cycles.failed.total})`
        } else if (cycleCounters.failed.action >= config.cycles.failed.action) {
            message = `Reached maximum action failed cycles (${config.cycles.failed.action})`
        } else {
            message = `Reached maximum format failed cycles (${config.cycles.failed.format})`
        }

        return {
            status: TaskStatus.FAILED,
            message,
            cycles,
        }
    }

    private async cycle(
        task: CreateTaskProps,
        page: PageWrapper,
        cycles: CycleReport[]
    ): Promise<CycleResult> {
        const startedAt = Date.now()

        await page.waitToLoad()

        const screenshot = await page.screenshot()
        if (!screenshot) {
            this.logger.error('Failed to take screenshot during cycle', {
                id: task.id,
            })
            return {
                status: CycleStatus.FORMAT_FAILED,
            }
        }

        const title = await page.title(),
            url = page.url
        if (!title || !url) {
            this.logger.error('Failed to get title or url during cycle', {
                id: task.id,
            })
            return {
                status: CycleStatus.FORMAT_FAILED,
            }
        }

        const messages = this.worker.mind.transformer.makePrompt({
            user: {
                title,
                url,
                task: task.prompt,
                previous_cycles: cycles,
                screenshot,
            },
        })
        if (!messages) {
            this.logger.error('Failed to make prompt during cycle', {
                id: task.id,
            })
            return {
                status: CycleStatus.FORMAT_FAILED,
            }
        }

        const completion = await this.worker.mind.model.generate(messages)
        if (!completion) {
            this.logger.error('Failed to generate completion during cycle', {
                id: task.id,
            })
            return {
                status: CycleStatus.FORMAT_FAILED,
            }
        }

        const parsed = this.worker.mind.parser.parse(completion)

        if (!parsed || !parsed.success) {
            this.logger.verbose('Failed to parse completion during cycle', {
                id: task.id,
                reason: parsed.error,
            })
            return {
                status: CycleStatus.FORMAT_FAILED,
            }
        }

        const action = parsed.action
        const status = await page.perform(action)

        return {
            status:
                status === ActionStatus.COMPLETED
                    ? CycleStatus.SUCCESS
                    : CycleStatus.ACTION_FAILED,
            report: {
                action: {
                    ...action,
                    status,
                },
                reasoning: parsed.reasoning,
                duration: Date.now() - startedAt,
            },
        }
    }
}
