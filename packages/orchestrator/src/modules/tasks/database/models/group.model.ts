import { ObjectLiteral } from '@domain/types'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

@Schema({
    timestamps: true,
    versionKey: false,
})
export class TaskGroup {
    @Prop({
        required: true,
        minlength: 6,
        maxlength: 512,
    })
    name: string

    constructor(group: ITaskGroup) {
        this.name = group.name
    }
}

export type TaskGroupDocument = HydratedDocument<TaskGroup>

export const TaskGroupSchema = SchemaFactory.createForClass(TaskGroup)

export interface ITaskGroup extends ObjectLiteral {
    _id: Types.ObjectId
    createdAt: Date
    updatedAt: Date

    name: string
}

export const SortableTaskGroupFiles = {
    name: 'name',
} satisfies {
    [key in keyof ITaskGroup]?: string
}
