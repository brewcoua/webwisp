import { IQuery, QueryHandler, IQueryHandler } from '@nestjs/cqrs'
import { Task } from '@webwisp/types/tasks'

import QueueService from '../services/queue/queue.service'

export default class GetTasksQuery implements IQuery {}

@QueryHandler(GetTasksQuery)
export class GetTasksHandler implements IQueryHandler<GetTasksQuery> {
    constructor(private readonly queueService: QueueService) {}

    async execute(query: GetTasksQuery): Promise<Task[]> {
        return Promise.resolve(this.queueService.peekAll())
    }
}
