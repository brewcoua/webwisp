import { Logger } from 'winston'
import amqp from 'amqplib'

import WorkerService from 'src/worker.service'

import TaskResult from '@domain/TaskResult'
import Task from '@domain/Task'
import ActionReport from '@domain/ActionReport'
import config from './execution.config'
import CycleResult from './domain/CycleResult'
import CycleStatus from './domain/CycleStatus'
import ActionType from '@domain/ActionType'
import TaskStatus from '@domain/TaskStatus'
import { PageWrapper } from '@services/browser/wrappers'
import ActionStatus from '@domain/ActionStatus'
import { WorkerEventType } from '@domain/WorkerEvent'

export default class ExecutionService {
    private readonly logger: Logger

    constructor(
        private readonly worker: WorkerService,
        logger: Logger
    ) {
        this.logger = logger.child({
            context: 'ExecutionService',
        })
        this.worker.rabbitmq?.bindTasks((msg) => this.listener(msg))
    }

    async listener(msg: amqp.ConsumeMessage) {
        const task = JSON.parse(msg.content.toString())
        this.logger.info('Received task', { task })

        const result = await this.execute(task)
        this.logger.info('Task executed', { result })

        const status = this.worker.rabbitmq?.emitEvent({
            type: WorkerEventType.TASK_COMPLETED,
            result,
        })
        if (status) {
            this.logger.info('Published result', { status })
        } else {
            this.logger.error('Failed to publish result')
        }
    }

    async execute(task: Task): Promise<TaskResult> {
        this.logger.verbose('Executing task', { id: task.id })
        this.worker.rabbitmq?.emitEvent({
            type: WorkerEventType.TASK_STARTED,
            task,
        })

        const actions: ActionReport[] = []
        const cycles = {
            total: 0,
            failed: {
                total: 0, // Total failed cycles
                action: 0, // Action fails
                format: 0, // Format is wrong
            },
        }
        const page = await this.worker.browser?.detach(task.target)
        if (!page) {
            return {
                id: task.id,
                status: TaskStatus.FAILED,
                message: 'Failed to attach to page',
                actions,
            }
        }

        while (
            cycles.total < config.cycles.total &&
            cycles.failed.total < config.cycles.failed.total &&
            cycles.failed.action < config.cycles.failed.action &&
            cycles.failed.format < config.cycles.failed.format
        ) {
            const cycleResult = await this.cycle(task, page, actions)
            cycles.total++

            switch (cycleResult.status) {
                case CycleStatus.SUCCESS: {
                    actions.push(cycleResult.report)
                    const action = cycleResult.report.action
                    if (action.type === ActionType.Done) {
                        return {
                            id: task.id,
                            status: action.arguments.success
                                ? TaskStatus.COMPLETED
                                : TaskStatus.FAILED,
                            message: action.arguments.reason.toString(),
                            value: action.arguments.value as string | undefined,
                            actions,
                        }
                    }
                    this.logger.verbose('Cycle completed', {
                        id: task.id,
                        cycle: cycles.total,
                        action: action,
                    })
                    this.worker.rabbitmq?.emitEvent({
                        type: WorkerEventType.CYCLE_COMPLETED,
                        report: cycleResult.report,
                    })
                    break
                }
                case CycleStatus.ACTION_FAILED:
                    cycles.failed.total++
                    cycles.failed.action++
                    actions.push(cycleResult.report)
                    this.logger.verbose('Cycle action failed', {
                        id: task.id,
                        cycle: cycles.total,
                        failed: cycles.failed,
                        action: cycleResult.report.action,
                    })
                    break
                case CycleStatus.FORMAT_FAILED:
                    cycles.failed.total++
                    cycles.failed.format++
                    this.logger.verbose('Cycle format failed', {
                        id: task.id,
                        cycle: cycles.total,
                        failed: cycles.failed,
                    })
                    break
            }
        }

        let message
        if (cycles.total >= config.cycles.total) {
            message = `Reached maximum cycles (${config.cycles.total})`
        } else if (cycles.failed.total >= config.cycles.failed.total) {
            message = `Reached maximum failed cycles (${config.cycles.failed.total})`
        } else if (cycles.failed.action >= config.cycles.failed.action) {
            message = `Reached maximum action failed cycles (${config.cycles.failed.action})`
        } else {
            message = `Reached maximum format failed cycles (${config.cycles.failed.format})`
        }

        return {
            id: task.id,
            status: TaskStatus.FAILED,
            message,
            value: JSON.stringify(actions),
            actions,
        }
    }

    private async cycle(
        task: Task,
        page: PageWrapper,
        actions: ActionReport[]
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

        const messages = this.worker.mind?.transformer.makePrompt({
            user: {
                title,
                url,
                task: task.prompt,
                previous_actions: actions,
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

        const completion = await this.worker.mind?.model.generate(messages)
        if (!completion) {
            this.logger.error('Failed to generate completion during cycle', {
                id: task.id,
            })
            return {
                status: CycleStatus.FORMAT_FAILED,
            }
        }

        const parsed = this.worker.mind?.parser.parse(completion)

        if (!parsed || !parsed.success) {
            this.logger.verbose('Failed to parse completion during cycle', {
                id: task.id,
                reason: parsed?.error,
            })
            return {
                status: CycleStatus.FORMAT_FAILED,
            }
        }

        const action = parsed.action
        const status = await page.perform(action)

        return {
            status:
                status === ActionStatus.Success
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
