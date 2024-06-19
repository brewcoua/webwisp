import makeLogger from '@configs/logger'
import { Logger } from 'winston'
import amqp from 'amqplib'

import { ResultsRepository, TasksRepository } from './repositories'
import RabbitMQService from '@services/rabbitmq'
import Task from '@domain/Task'

export default class WorkerService {
    private readonly logger: Logger = makeLogger().child({
        context: 'WorkerService',
    })

    private rabbitMQService: RabbitMQService | null = null

    private tasksRepository: TasksRepository | null = null
    private resultsRepository: ResultsRepository | null = null

    async initialize() {
        this.logger.info('Initializing WorkerService')

        this.rabbitMQService = new RabbitMQService()
        await this.rabbitMQService.initialize()

        this.tasksRepository = new TasksRepository(this.rabbitMQService)
        await this.tasksRepository.initialize()

        this.tasksRepository.bind((msg) => {
            const task: Task = JSON.parse(msg.content.toString())
            this.handleTask(msg, task)
        })

        this.resultsRepository = new ResultsRepository(this.rabbitMQService)
        await this.resultsRepository.initialize()

        this.logger.info('WorkerService initialized')
    }

    async handleTask(msg: amqp.ConsumeMessage, task: Task) {
        this.logger.info('Handling task', { task })
    }
}
