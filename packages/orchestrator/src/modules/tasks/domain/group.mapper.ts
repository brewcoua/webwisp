import { Mapper } from '@domain/ddd'
import { Injectable } from '@nestjs/common'
import TaskGroupEntity from './group.entity'
import { ITaskGroup } from '../database/models/group.model'
import TaskGroupResponseDto from '../dtos/group.response.dto'
import { MongoUtils } from '@domain/utils'

@Injectable()
export default class TaskGroupMapper
    implements Mapper<TaskGroupEntity, ITaskGroup, TaskGroupResponseDto>
{
    toPersistence(entity: TaskGroupEntity): ITaskGroup {
        const copy = entity.getProps()

        return {
            _id: MongoUtils.toObjectId(copy.id),
            createdAt: copy.createdAt,
            updatedAt: copy.updatedAt,
            name: copy.name,
        }
    }

    toDomain(record: ITaskGroup): TaskGroupEntity {
        return new TaskGroupEntity({
            id: MongoUtils.fromObjectId(record._id),
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
            props: {
                name: record.name,
            },
        })
    }

    toResponse(entity: TaskGroupEntity): TaskGroupResponseDto {
        const props = entity.getProps()
        const response = new TaskGroupResponseDto({
            id: props.id,
            createdAt: props.createdAt,
            updatedAt: props.updatedAt,
            name: props.name,
        })

        return response
    }
}
