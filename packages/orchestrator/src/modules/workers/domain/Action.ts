import { ApiProperty } from '@nestjs/swagger'
import ActionStatus from './ActionStatus'
import ActionType from './ActionType'

export type Action = {
    type: ActionType
    description: string
    arguments: ActionArguments
    status: ActionStatus
}

export type ActionArguments = Record<string, ActionArgumentPrimitive>
export type ActionArgumentPrimitive = string | number | boolean

export default Action

export class ActionEntity implements Action {
    @ApiProperty({
        type: String,
        description: 'Action type',
        enum: ActionType,
        enumName: 'ActionType',
    })
    type: ActionType

    @ApiProperty({
        type: String,
        description: 'Action description',
        example: 'Create a new file',
    })
    description: string

    @ApiProperty({
        type: Object,
        description: 'Action arguments',
        example: { path: '/path/to/file' },
    })
    arguments: ActionArguments

    @ApiProperty({
        type: String,
        description: 'Action status',
        enum: ActionStatus,
        enumName: 'ActionStatus',
    })
    status: ActionStatus

    constructor(action: Action) {
        this.type = action.type
        this.description = action.description
        this.arguments = action.arguments
        this.status = action.status
    }
}
