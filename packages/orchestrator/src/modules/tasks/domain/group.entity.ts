import { Entity } from '@domain/ddd'
import { CreateTaskGroupProps, TaskGroupProps } from './group.types'
import { AggregateID } from '@domain/ddd/entity.base'

export default class TaskGroupEntity extends Entity<TaskGroupProps> {
    static create(create: CreateTaskGroupProps) {
        const id = AggregateID.create()

        const group = new TaskGroupEntity({
            id,
            props: {
                ...create,
            },
        })

        return group
    }

    public validate(): void {
        // Check that name is valid
        if (this.props.name.length < 6 || this.props.name.length > 512) {
            throw new Error(`Invalid name: ${this.props.name}`)
        }
    }
}
