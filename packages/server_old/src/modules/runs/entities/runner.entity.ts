import { ApiProperty } from '@nestjs/swagger'
import {
    ActionReport,
    Runner as IRunner,
    RunnerStatus,
    TaskResult,
} from '@webwisp/types'

export default class RunnerEntity implements IRunner {
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

    @ApiProperty({
        type: 'array',
        description: 'The actions of the runner.',
    })
    actions: ActionReport[]

    @ApiProperty({
        type: 'object',
        description: 'The result of the runner.',
    })
    result?: TaskResult

    constructor(runner: IRunner) {
        this.id = runner.id
        this.status = runner.status
        this.pageId = runner.pageId
        this.createdAt = runner.createdAt
        this.config = runner.config
        this.actions = runner.actions
        this.result = runner.result
    }
}
