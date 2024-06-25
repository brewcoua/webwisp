import { Entity } from '@domain/ddd'
import { AggregateID } from '@domain/ddd/entity.base'

import { CreateTaskProps, CycleReport, TaskProps, TaskStatus } from './task.types'

export default class TaskEntity extends Entity<TaskProps> {
    static create(create: CreateTaskProps) {
        const id = AggregateID.create()

        const task = new TaskEntity({
            id,
            props: {
                ...create,
                status: TaskStatus.PENDING,
                cycles: [],
            },
        })

        return task
    }

    validate() {
        // Check that status is valid
        if (!Object.values(TaskStatus).includes(this.props.status)) {
            throw new Error(`Invalid status: ${this.props.status}`)
        }
    }

    pushCycle(cycle: CycleReport) {
        this.props.cycles.push(cycle)
    }

    setStatus(status: TaskStatus) {
        if (!Object.values(TaskStatus).includes(status)) {
            throw new Error(`Invalid status: ${status}`)
        }

        this.props.status = status
    }
}
