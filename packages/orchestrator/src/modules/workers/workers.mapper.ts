import { HalfMapper } from '@domain/ddd'
import { Injectable } from '@nestjs/common'
import WorkerEntity from './domain/worker.entity'
import WorkerResponseDto from './dtos/worker.response.dto'

@Injectable()
export default class WorkersMapper
    implements HalfMapper<WorkerEntity, WorkerResponseDto>
{
    toResponse(entity: WorkerEntity): WorkerResponseDto {
        const props = entity.getProps()
        const response = new WorkerResponseDto({
            id: entity.id,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,

            tag: props.tag,
            status: props.status,
            task: props.task,
        })

        return response
    }
}
