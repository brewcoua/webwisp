import { Injectable } from '@nestjs/common'

import { Mapper } from '@domain/ddd'
import { MongoUtils } from '@domain/utils'

import TaskEntity from './domain/task.entity'
import { ITask } from './database/models/task.model'
import TaskResponseDto from './dtos/task.response.dto'

@Injectable()
export default class TasksMapper
    implements Mapper<TaskEntity, ITask, TaskResponseDto>
{
    toPersistence(entity: TaskEntity): ITask {
        const copy = entity.getProps()

        return {
            _id: MongoUtils.toObjectId(copy.id),
            createdAt: copy.createdAt,
            updatedAt: copy.updatedAt,

            target: copy.target,
            prompt: copy.prompt,
            status: copy.status,

            message: copy.message,
            value: copy.value,
            cycles: copy.cycles,

            group:
                (copy.group && MongoUtils.toObjectId(copy.group)) || undefined,
            difficulty: copy.difficulty,
            evaluation: copy.evaluation,
        }
    }

    toDomain(record: ITask): TaskEntity {
        return new TaskEntity({
            id: MongoUtils.fromObjectId(record._id),
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
            props: {
                target: record.target,
                prompt: record.prompt,
                status: record.status,

                message: record.message,
                value: record.value,
                cycles: record.cycles,

                group: record.group && MongoUtils.fromObjectId(record.group),
                difficulty: record.difficulty,
                evaluation: record.evaluation,
            },
        })
    }

    toResponse(entity: TaskEntity): TaskResponseDto {
        const props = entity.getProps()
        const response = new TaskResponseDto({
            id: props.id,
            createdAt: props.createdAt,
            updatedAt: props.updatedAt,

            target: props.target,
            prompt: props.prompt,
            status: props.status,

            message: props.message,
            value: props.value,
            cycles: props.cycles,

            group: props.group,
            difficulty: props.difficulty,
            evaluation: props.evaluation,
        })

        return response
    }
}
