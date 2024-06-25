import { Entity } from '@domain/ddd'

import { CreateWorkerProps, WorkerProps, WorkerStatus } from './worker.types'

export default class WorkerEntity extends Entity<WorkerProps> {
    static create(create: CreateWorkerProps) {
        const worker = new WorkerEntity({
            id: create.id,
            props: {
                ...create,
                status: WorkerStatus.READY,
            },
        })

        return worker
    }

    validate() {
        if (!Object.values(WorkerStatus).includes(this.props.status)) {
            throw new Error('Invalid status: ' + this.props.status)
        }
    }

    setStatus(status: WorkerStatus) {
        if (!Object.values(WorkerStatus).includes(status)) {
            throw new Error('Invalid status: ' + status)
        }
        this.props.status = status
    }

    setTask(task: string) {
        if (!task.match(/^[0-9a-fA-F]{24}$/)) {
            throw new Error('Invalid task ID: ' + task)
        }
        this.props.task = task
    }
}
