import AbstractArgument from './AbstractArgument'

export type AbstractAction = {
    description: string
    arguments?: AbstractArgument[]
    example: string
}

export default AbstractAction
