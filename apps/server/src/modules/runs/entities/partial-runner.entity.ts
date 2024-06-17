import { ApiProperty } from '@nestjs/swagger'
import { Runner as IRunner, RunnerStatus } from '@webwisp/types'

export default class PartialRunnerEntity {
    @ApiProperty({
        type: 'string',
        description: 'The ID of the runner. (nanoid)',
        example: 'V1StGXR8_Z5jdHi6B-myT',
    })
    id: string

    @ApiProperty({
        type: 'string',
        description: 'The status of the runner.',
        enum: RunnerStatus,
        enumName: 'RunnerStatus',
        example: RunnerStatus.NOT_STARTED,
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

    constructor(runner: IRunner) {
        this.id = runner.id
        this.status = runner.status
        this.createdAt = runner.createdAt
        this.config = runner.config
    }
}
