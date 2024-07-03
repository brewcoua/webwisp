import { ObjectLiteral } from '@domain/types'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

import { CycleReport, CycleReportSchema } from './cycle-report.model'
import { TaskProps, TaskStatus } from '../../domain/task.types'
import { TaskDifficultyProps } from '@modules/tasks/domain/task.eval'

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

    @Prop({
        required: false,
        type: Types.ObjectId,
    })
    group?: Types.ObjectId

    @Prop({
        required: false,
        type: Object,
    })
    difficulty?: TaskDifficultyProps

    @Prop({
        required: false,
        type: Object,
    })
    evaluation?: TaskProps['evaluation']

    constructor(task: Task) {
        this.target = task.target
        this.prompt = task.prompt
        this.status = task.status
        this.message = task.message
        this.value = task.value
        this.cycles = task.cycles
        this.group = task.group
        this.difficulty = task.difficulty
        this.evaluation = task.evaluation
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

    group?: Types.ObjectId
    difficulty?: TaskDifficultyProps
    evaluation?: TaskProps['evaluation']
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
