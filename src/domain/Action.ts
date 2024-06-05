import ActionArgument from './ActionArgument'

export type Action = {
    description: string
    arguments?: ActionArgument[]
}

export default Action
