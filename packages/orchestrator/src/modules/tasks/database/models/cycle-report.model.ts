import { ObjectLiteral } from '@domain/types'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

import { Action, ActionSchema, IAction } from './action.model'

@Schema({
    timestamps: false,
    versionKey: false,
    id: false,
})
export class CycleReport {
    @Prop({
        required: true,
        type: ActionSchema,
    })
    action: Action

    @Prop({
        required: false,
        type: String,
        minlength: 6,
        maxlength: 1024,
    })
    reasoning?: string

    @Prop({
        required: true,
        type: Number,
        min: 0,
    })
    duration: number

    constructor(report: ICycleReport) {
        this.action = report.action
        this.reasoning = report.reasoning
        this.duration = report.duration
    }
}

export type CycleReportDocument = HydratedDocument<CycleReport>

export const CycleReportSchema = SchemaFactory.createForClass(CycleReport)

export interface ICycleReport extends ObjectLiteral {
    action: IAction
    reasoning?: string
    duration: number
}
