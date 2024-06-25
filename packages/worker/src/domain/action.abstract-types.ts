export type AbstractAction = {
    description: string
    arguments?: AbstractArgument[]
    example: string
}

export type AbstractArgument = {
    name: string
    type: AbstractArgumentType
    enum?: string[]
    required?: boolean
}

export enum AbstractArgumentType {
    STRING = 'string',
    NUMBER = 'number',
    BOOLEAN = 'boolean',
}
