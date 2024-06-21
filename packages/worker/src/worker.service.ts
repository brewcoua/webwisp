import makeLogger from '@configs/logger'
import { Logger } from 'winston'
import { nanoid } from 'nanoid'

import BrowserService from '@services/browser'
import MindService from '@services/mind'
import RabbitMQService from '@services/rabbitmq'
import ExecutionService from '@services/exec'

export default class WorkerService {
    private readonly logger: Logger = makeLogger().child({
        context: 'WorkerService',
    })

    public readonly id = nanoid()

    private execution: ExecutionService | null = null
    public rabbitmq: RabbitMQService | null = null
    public browser: BrowserService | null = null
    public mind: MindService | null = null

    async initialize() {
        this.logger.info('Initializing WorkerService')

        this.rabbitmq = new RabbitMQService(this.id, this.logger)
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

    async close() {
        this.logger.info('Closing WorkerService')

        await Promise.all([this.rabbitmq?.close(), this.browser?.destroy()])

        this.logger.info('WorkerService closed')
    }
}
