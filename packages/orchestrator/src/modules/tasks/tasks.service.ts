import { Injectable } from '@nestjs/common'

import { Task } from './domain'
import { RabbitMQRepository } from './repositories'

@Injectable()
export default class TasksService {
    constructor(private readonly rabbitMQRepository: RabbitMQRepository) {}

    publish(task: Task): boolean {
        return this.rabbitMQRepository.publish(JSON.stringify(task))
    }
}
