import { InjectModel } from '@nestjs/mongoose'
import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'

import { MongoRepositoryBase } from '@domain/db/mongo-repository.base'
import TaskGroupEntity from '../../domain/group.entity'
import { ITaskGroup, TaskGroup } from '../models/group.model'
import TaskGroupMapper from '../../domain/group.mapper'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { TaskGroupRepositoryPort } from './group.repository.port'

@Injectable()
export default class TaskGroupRepository
    extends MongoRepositoryBase<TaskGroupEntity, ITaskGroup>
    implements TaskGroupRepositoryPort
{
    constructor(
        @InjectModel(TaskGroup.name) protected readonly model: Model<TaskGroup>,
        mapper: TaskGroupMapper,
        eventEmitter: EventEmitter2
    ) {
        super(mapper, eventEmitter)
    }
}
