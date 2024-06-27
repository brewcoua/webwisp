import { Command, CommandProps } from '@domain/ddd'
import { CreateTaskProps } from '../../domain/task.types'

export class BulkTasksCommand extends Command {
    readonly tasks: CreateTaskProps[]

    constructor(props: CommandProps<BulkTasksCommand>) {
        super(props)
        this.tasks = props.tasks
    }
}
