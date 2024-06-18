export type AbstractArgument = {
    name: string
    type: AbstractArgumentType
    enum?: string[]
    required?: boolean
}
export enum AbstractArgumentType {
    String = 'string',
    Number = 'number',
    Boolean = 'boolean',
}

export default AbstractArgument
