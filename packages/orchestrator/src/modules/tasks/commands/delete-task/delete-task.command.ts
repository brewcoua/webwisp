import { Command, CommandProps } from '@domain/ddd'

export class DeleteTaskCommand extends Command {
    readonly task_id: string

    constructor(props: CommandProps<DeleteTaskCommand>) {
        super(props)
        this.task_id = props.task_id
    }
}
