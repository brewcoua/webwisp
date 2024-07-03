import { Command, CommandProps } from '@domain/ddd'

export class CreateTaskGroupCommand extends Command {
    readonly name: string

    constructor(props: CommandProps<CreateTaskGroupCommand>) {
        super(props)
        this.name = props.name
    }
}
