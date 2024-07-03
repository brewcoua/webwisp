import { Command, CommandProps } from '@domain/ddd'
import {
    TaskDifficultyProps,
    TaskEvaluationProps,
} from '../../domain/task.eval'
import { LoginScripts } from '../../domain/task.types'

export class CreateTaskCommand extends Command {
    readonly target: string
    readonly prompt: string

    readonly login_script?: LoginScripts
    readonly group?: string
    readonly difficulty?: TaskDifficultyProps
    readonly evaluation?: TaskEvaluationProps

    constructor(props: CommandProps<CreateTaskCommand>) {
        super(props)
        this.target = props.target
        this.prompt = props.prompt
        this.login_script = props.login_script
        this.group = props.group
        this.difficulty = props.difficulty
        this.evaluation = props.evaluation
    }
}
