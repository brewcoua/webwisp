import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Model } from 'mongoose'

import { MongoRepositoryBase } from '@domain/db/mongo-repository.base'

import TaskEntity from '../../domain/task.entity'
import { ITask, Task } from '../models/task.model'
import { TaskRepositoryPort } from './task.repository.port'
import TasksMapper from '../../tasks.mapper'

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
}
