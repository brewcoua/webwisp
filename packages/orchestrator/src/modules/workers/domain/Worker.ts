import { ApiProperty } from '@nestjs/swagger'

import { Task, TaskEntity } from '@modules/tasks/domain/Task'
import WorkerStatus from './WorkerStatus'

export interface Worker {
    id: string
    tag: string
    createdAt: Date
    updatedAt: Date
    status: WorkerStatus
    task?: Task
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
        type: TaskEntity,
        description: 'Task assigned to the worker',
    })
    task?: Task

    constructor(worker: Worker) {
        this.id = worker.id
        this.tag = worker.tag
        this.createdAt = worker.createdAt
        this.updatedAt = worker.updatedAt
        this.status = worker.status
        this.task = worker.task
    }
}
