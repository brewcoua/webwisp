import { ApiProperty } from '@nestjs/swagger'

import WorkerStatus from './WorkerStatus'

export interface Worker {
    id: string
    tag: string
    createdAt: Date
    updatedAt: Date
    status: WorkerStatus
    task_id?: string
}
export default Worker

export class WorkerEntity implements Worker {
    @ApiProperty({
        type: String,
        description: 'Worker ID',
    })
    id: string

    @ApiProperty({
        type: String,
        description: 'Worker consumer tag',
    })
    tag: string

    @ApiProperty({
        type: Date,
        description: 'Worker creation date',
    })
    createdAt: Date

    @ApiProperty({
        type: Date,
        description: 'Worker last update date',
    })
    updatedAt: Date

    @ApiProperty({
        type: String,
        description: 'Worker status',
        enum: WorkerStatus,
        enumName: 'WorkerStatus',
    })
    status: WorkerStatus

    @ApiProperty({
        type: String,
        description: 'ID of the task being executed by the worker',
    })
    task_id?: string

    constructor(worker: Worker) {
        this.id = worker.id
        this.tag = worker.tag
        this.createdAt = worker.createdAt
        this.updatedAt = worker.updatedAt
        this.status = worker.status
        this.task_id = worker.task_id
    }
}
