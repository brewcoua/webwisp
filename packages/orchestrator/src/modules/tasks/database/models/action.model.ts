import { ObjectLiteral } from '@domain/types'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

import { ActionStatus, ActionType } from '../../domain/action.types'

@Schema({
    timestamps: false,
    versionKey: false,
})
export class Action {
    @Prop({
        required: true,
        type: String,
        enum: ActionType,
    })
    type: ActionType

    @Prop({
        required: true,
        type: String,
        minlength: 3,
        maxlength: 2048,
    })
    description: string

    @Prop({
        required: true,
        type: String,
        enum: ActionStatus,
    })
    status: ActionStatus

    @Prop({
        required: true,
        type: Object,
    })
    arguments: Record<string, string | number | boolean>

    constructor(action: IAction) {
        this.type = action.type
        this.description = action.description
        this.arguments = action.arguments
        this.status = action.status
    }
}

export type ActionDocument = HydratedDocument<Action>

export const ActionSchema = SchemaFactory.createForClass(Action)

export interface IAction extends ObjectLiteral {
    type: ActionType
    description: string
    arguments: Record<string, string | number | boolean>
    status: ActionStatus
}
