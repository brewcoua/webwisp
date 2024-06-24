import { Command, CommandProps } from '@domain/ddd'

export class SignUpCommand extends Command {
    readonly username: string
    readonly password: string

    constructor(props: CommandProps<SignUpCommand>) {
        super(props)
        this.username = props.username
        this.password = props.password
    }
}
