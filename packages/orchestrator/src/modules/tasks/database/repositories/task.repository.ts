import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Model } from 'mongoose'

import { MongoRepositoryBase } from '@domain/db/mongo-repository.base'

import TaskEntity from '../../domain/task.entity'
import { ITask, Task } from '../models/task.model'
import { TaskRepositoryPort } from './task.repository.port'
import TasksMapper from '../../tasks.mapper'
import { MatchQueryParams, PaginatedQueryParams } from '@domain/ddd'
import { MongoUtils } from '@domain/utils'

@Injectable()
export default class TaskRepository
    extends MongoRepositoryBase<TaskEntity, ITask>
    implements TaskRepositoryPort
{
    constructor(
        @InjectModel(Task.name) protected readonly model: Model<Task>,
        mapper: TasksMapper,
        eventEmitter: EventEmitter2
    ) {
        super(mapper, eventEmitter)
    }

    public async findAllPaginatedByGroup(
        params: PaginatedQueryParams,
        group?: string,
        matches?: MatchQueryParams[]
    ) {
        return this.findPaginated(params, [
            // If group is undefined, match all tasks that don't have a group
            {
                $match: {
                    group: group
                        ? MongoUtils.toObjectId(group)
                        : { $exists: false },
                },
            },
            ...(matches || []).map((match) => ({
                $match: {
                    [match.key]: {
                        $regex: match.query,
                        $options: 'i',
                    },
                },
            })),
        ])
    }
}
