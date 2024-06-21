import { ApiProperty } from '@nestjs/swagger'
import Action, { ActionEntity } from './Action'

/**
 * Represents a report of an action execution.
 * @public
 */
export type ActionReport = {
    action: Action
    reasoning?: string
    duration: number
}
export default ActionReport

export class ActionReportEntity implements ActionReport {
    @ApiProperty({
        type: ActionEntity,
        description: 'Action',
    })
    action: Action

    @ApiProperty({
        type: String,
        description: 'Reasoning',
        example: 'Action completed successfully',
    })
    reasoning?: string

    @ApiProperty({
        type: Number,
        description: 'Action duration in milliseconds',
        example: 100,
    })
    duration: number

    constructor(report: ActionReport) {
        this.action = report.action
        this.reasoning = report.reasoning
        this.duration = report.duration
    }
}
