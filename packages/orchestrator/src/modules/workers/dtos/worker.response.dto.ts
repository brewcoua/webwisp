import { BaseResponseProps, ResponseBase } from '@domain/api/response.base'
import { ApiProperty } from '@nestjs/swagger'
import { WorkerProps, WorkerStatus } from '../domain/worker.types'

export default class WorkerResponseDto extends ResponseBase {
    @ApiProperty({
        example: '60f3b3b3b9b3f0001f000001',
        description: 'Worker Consumer Tag',
    })
    readonly tag: string

    @ApiProperty({
        example: WorkerStatus.READY,
        description: 'Worker Status',
        enum: WorkerStatus,
        enumName: 'WorkerStatus',
    })
    readonly status: WorkerStatus

    @ApiProperty({
        example: '60f3b3b3b9b3f0001f000001',
        description: 'Assigned Task ID',
    })
    readonly task?: string

    constructor(props: WorkerProps & BaseResponseProps) {
        super(props)
        this.tag = props.tag
        this.status = props.status
        this.task = props.task
    }
}
