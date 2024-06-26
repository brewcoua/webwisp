import { ObjectLiteral } from '@domain/types'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

import { CycleReport, CycleReportSchema } from './cycle-report.model'
import { TaskStatus } from '../../domain/task.types'

@Schema({
    timestamps: true,
    versionKey: false,
})
export class Task {
    @Prop({
        required: true,
        minlength: 6,
        maxlength: 512,
        validate: {
            validator: (v: string) => {
                try {
                    new URL(v)
                    return true
                } catch {
                    return false
                }
            },
            message: 'Invalid URL',
        },
    })
    target: string

    @Prop({
        required: true,
        minlength: 6,
        maxlength: 1024,
    })
    prompt: string

    @Prop({
        required: true,
        type: String,
        enum: TaskStatus,
    })
    status: TaskStatus

    @Prop({
        required: false,
        type: String,
        minlength: 6,
        maxlength: 1024,
    })
    message?: string

    @Prop({
        required: false,
        type: String,
        maxlength: 512,
    })
    value?: string

    @Prop({
        required: true,
        default: [],
        type: [CycleReportSchema],
    })
    cycles: CycleReport[]

    constructor(task: Task) {
        this.target = task.target
        this.prompt = task.prompt
        this.status = task.status
        this.message = task.message
        this.value = task.value
        this.cycles = task.cycles
    }
}

export type TaskDocument = HydratedDocument<Task>

export const TaskSchema = SchemaFactory.createForClass(Task)

export interface ITask extends ObjectLiteral {
    _id: Types.ObjectId
    createdAt: Date
    updatedAt: Date

    target: string
    prompt: string
    status: TaskStatus

    message?: string
    value?: string
    cycles: CycleReport[]
}

export const SortableTaskFields = {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    status: 'status',
} satisfies {
    [key in keyof ITask]?: string
}

export type SortableTaskField =
    (typeof SortableTaskFields)[keyof typeof SortableTaskFields]
