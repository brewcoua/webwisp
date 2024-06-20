import makeLogger from '@configs/logger'
import { Logger } from 'winston'
import amqp from 'amqplib'

import BrowserService from '@services/browser'
import MindService from '@services/mind'
import RabbitMQService from '@services/rabbitmq'
import ExecutionService from '@services/exec'

import Task from '@domain/Task'

export default class WorkerService {
    private readonly logger: Logger = makeLogger().child({
        context: 'WorkerService',
    })

    private execution: ExecutionService | null = null
    public rabbitmq: RabbitMQService | null = null
    public browser: BrowserService | null = null
    public mind: MindService | null = null

    async initialize() {
        this.logger.info('Initializing WorkerService')

        this.rabbitmq = new RabbitMQService(this.logger)
        this.browser = new BrowserService(this.logger)
        this.mind = new MindService(this.logger)

        await Promise.all([
            this.rabbitmq.initialize(),
            this.browser.initialize(),
            this.mind.initialize(),
        ])

        this.execution = new ExecutionService(this, this.logger)

        this.logger.info('WorkerService initialized')
    }
}
