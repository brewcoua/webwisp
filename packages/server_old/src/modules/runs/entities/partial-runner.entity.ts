import { ApiProperty } from '@nestjs/swagger'
import { Runner as IRunner, RunnerStatus, PartialRunner } from '@webwisp/types'

export default class PartialRunnerEntity implements PartialRunner {
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
        type: 'string',
        description: 'The ID of the page.',
        example: 'D054E459E2C5D7749A57E3A2E3E28FCC',
    })
    pageId: string

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
        this.pageId = runner.pageId
        this.config = runner.config
    }
}
