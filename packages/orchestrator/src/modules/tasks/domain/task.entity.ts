import { Entity } from '@domain/ddd'
import { AggregateID } from '@domain/ddd/entity.base'

import { TaskProps, TaskStatus } from './task.types'

export default class TaskEntity extends Entity<TaskProps> {
    static create(create: TaskProps) {
        const id = AggregateID.create()

        const task = new TaskEntity({
            id,
            props: create,
        })

        return task
    }

    validate() {
        // Check that status is valid
        if (!Object.values(TaskStatus).includes(this.props.status)) {
            throw new Error(`Invalid status: ${this.props.status}`)
        }
    }
}
