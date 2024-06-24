import { Command, CommandProps } from '@domain/ddd'

export class CreateTaskCommand extends Command {
    readonly target: string
    readonly prompt: string

    constructor(props: CommandProps<CreateTaskCommand>) {
        super(props)
        this.target = props.target
        this.prompt = props.prompt
    }
}
