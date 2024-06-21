import { ApiProperty } from '@nestjs/swagger'
import ActionReport, { ActionReportEntity } from './ActionReport'
import TaskStatus from './TaskStatus'

export default interface TaskResult {
    id: string
    status: TaskStatus
    message: string
    value?: string
    actions: ActionReport[]
}

export class TaskResultEntity implements TaskResult {
    @ApiProperty({
        type: String,
        description: 'Task ID',
        example: 'V1StGXR8_Z5jdHi6B-myT',
    })
    id: string

    @ApiProperty({
        type: String,
        description: 'Task status',
        enum: TaskStatus,
        enumName: 'TaskStatus',
    })
    status: TaskStatus

    @ApiProperty({
        type: String,
        description: 'Task message',
        example: 'Task completed',
    })
    message: string

    @ApiProperty({
        type: String,
        description: 'Task value',
        example: 'Task value',
    })
    value?: string

    @ApiProperty({
        type: ActionReportEntity,
        description: 'Task actions',
        isArray: true,
    })
    actions: ActionReport[]

    constructor(result: TaskResult) {
        this.id = result.id
        this.status = result.status
        this.message = result.message
        this.value = result.value
        this.actions = result.actions
    }
}
