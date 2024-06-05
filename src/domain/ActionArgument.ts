export type ActionArgument = {
    name: string
    type: ActionArgumentType
    enum?: string[]
    required?: boolean
}
export type ActionArgumentPrimitive = string | number | boolean
export enum ActionArgumentType {
    String = 'string',
    Number = 'number',
    Boolean = 'boolean',
}

export default ActionArgument
