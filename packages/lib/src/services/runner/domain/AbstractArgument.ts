export type AbstractArgument = {
    name: string
    type: AbstractArgumentType
    enum?: string[]
    required?: boolean
}
export type AbstractArgumentPrimitive = string | number | boolean
export enum AbstractArgumentType {
    String = 'string',
    Number = 'number',
    Boolean = 'boolean',
}

export default AbstractArgument
