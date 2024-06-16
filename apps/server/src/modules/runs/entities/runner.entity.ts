import { ApiProperty } from '@nestjs/swagger'
import { ActionReport, Runner as IRunner, RunnerStatus } from '@webwisp/types'

export default class RunnerEntity implements IRunner {
    @ApiProperty({
        type: 'number',
        description: 'The ID of the runner.',
        example: 1,
    })
    id: number

    @ApiProperty({
        type: 'string',
        description: 'The name of the runner.',
        example: 'Runner',
    })
    name: string

    @ApiProperty({
        type: 'string',
        description: 'The status of the runner.',
        enum: RunnerStatus,
        enumName: 'RunnerStatus',
        example: RunnerStatus.PENDING,
    })
    status: RunnerStatus

    @ApiProperty({
        type: 'string',
        description: 'The creation date of the runner.',
        example: new Date(0).toISOString(),
    })
    createdAt: Date

    @ApiProperty({
        type: 'object',
        description: 'The configuration of the runner.',
        example: { target: 'https://example.com', prompt: 'Run prompt' },
    })
    config: {
        target: string
        prompt: string
    }

    @ApiProperty({
        type: 'array',
        description: 'The actions of the runner.',
    })
    actions: ActionReport[]

    constructor(runner: IRunner) {
        this.id = runner.id
        this.name = runner.name
        this.status = runner.status
        this.createdAt = runner.createdAt
        this.config = runner.config
        this.actions = runner.actions
    }
}
