import { BaseResponseProps, ResponseBase } from '@domain/api/response.base'
import { ApiProperty } from '@nestjs/swagger'
import { CycleReport, TaskProps, TaskStatus } from '../domain/task.types'

export default class TaskResponseDto extends ResponseBase {
    @ApiProperty({
        example: 'https://example.com',
        description: 'The URL of the task',
        pattern: '^https?://',
    })
    readonly target: string

    @ApiProperty({
        example: 'Create a new file',
        description: 'The prompt of the task',
    })
    readonly prompt: string

    @ApiProperty({
        example: TaskStatus.PENDING,
        description: 'The status of the task',
        enum: TaskStatus,
        enumName: 'TaskStatus',
    })
    readonly status: TaskStatus

    @ApiProperty({
        example: 'The task has been completed',
        description: 'The message of the task',
    })
    readonly message?: string

    @ApiProperty({
        example: 'https://example.com/file.txt',
        description: 'The value of the task',
    })
    readonly value?: string

    @ApiProperty({
        type: [Object],
        description: 'The cycles of the task',
    })
    readonly cycles: CycleReport[]

    constructor(props: TaskProps & BaseResponseProps) {
        super(props)
        this.target = props.target
        this.prompt = props.prompt
        this.status = props.status
        this.message = props.message
        this.value = props.value
        this.cycles = props.cycles
    }
}
