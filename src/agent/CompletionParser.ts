import Action from '@/domain/Action'
import ActionArgument, {
    ActionArgumentPrimitive,
    ActionArgumentType,
} from '@/domain/ActionArgument'
import ActionType from '@/domain/ActionType'
import CalledAction from '@/domain/CalledAction'
import { getConfig } from '@/domain/Config'

const RAW_ACTION_REGEX = /~~~([^]*)~~~/

export default class CompletionParser {
    public static parse(completion: string): Completion {
        const rawAction = completion.match(RAW_ACTION_REGEX)
        if (!rawAction) {
            throw new CompletionFormatError('No action found in completion')
        }

        const action = this.parseAction(rawAction[1].trim())

        const reasoning = completion
            .split('## Action ##')
            .at(1)
            ?.split('~~~')
            .at(0)
            ?.trim()
        if (reasoning) {
            return {
                reasoning,
                action,
            }
        }

        return {
            action,
        }
    }

    private static parseAction(action: string): CalledAction {
        const lines = action.split('\n')

        if (lines.length !== 2) {
            throw new CompletionFormatError(
                'Invalid action format (not 2 lines long)'
            )
        }

        const description = lines[0].trim()
        if (
            !description ||
            !description.startsWith('$ ') ||
            description.length < 3
        ) {
            throw new CompletionFormatError(
                'Invalid action format (description not found or with invalid format)'
            )
        }

        const actionLine = lines[1].trim()
        if (!actionLine) {
            throw new CompletionFormatError(
                'Invalid action format (action line not found)'
            )
        }

        const actionType = actionLine.split(' ')[0] as ActionType
        const actionInfo = getConfig().actions[actionType]
        if (!actionInfo) {
            throw new CompletionFormatError(
                `Action ${actionType} not found in config`
            )
        }

        const args = actionLine.substring(actionType.length).trim()
        const parsedArgs = this.parseArgs(args, actionType, actionInfo)

        return {
            type: actionType,
            description: description.substring(2),
            arguments: parsedArgs,
        }
    }

    private static parseArgs(
        args: string,
        actionType: ActionType,
        actionInfo: Action
    ): Record<string, string | number | boolean> {
        const parsedArgs = {} as Record<string, string | number | boolean>
        if (!actionInfo.arguments) {
            return parsedArgs
        }

        let cursor = 0,
            count = 0,
            buf = ''

        const state = {
            string: {
                inside: false,
                char: '',
            },
        }

        while (cursor < args.length) {
            const char = args[cursor]

            if (char === ' ') {
                if (state.string.inside) {
                    buf += char
                    cursor++
                    continue
                }

                const currentArg = actionInfo.arguments[count]
                parsedArgs[currentArg.name] = this.parseArg(buf, currentArg)

                buf = ''
                count++

                if (count > actionInfo.arguments.length) {
                    throw new CompletionFormatError(
                        `Too many arguments for action ${actionType}`
                    )
                }

                cursor++
                continue
            }

            if (char === '"' || char === "'") {
                if (state.string.inside && state.string.char === char) {
                    state.string.inside = false
                } else {
                    state.string.inside = true
                    state.string.char = char
                }
                cursor++
                continue
            }

            if (char === '\\') {
                if (state.string.inside) {
                    buf += args[++cursor]
                } else {
                    throw new CompletionFormatError(
                        'Invalid escape character outside of string'
                    )
                }
                cursor++
                continue
            }

            buf += char
            cursor++
        }

        if (buf) {
            const currentArg = actionInfo.arguments[count]
            parsedArgs[currentArg.name] = this.parseArg(buf, currentArg)
            count++
        }

        // See if we're missing any required arguments
        const requiredArgs =
            actionInfo.arguments?.filter((arg) => arg.required) || []
        if (requiredArgs.length > count) {
            throw new CompletionFormatError(
                `Missing required arguments for action ${actionType}:\n'${Object.keys(parsedArgs).join(' ')}' != '${requiredArgs.map((arg) => `${arg.name}`).join(' ')}'`
            )
        }

        return parsedArgs
    }

    private static parseArg(
        buf: string,
        arg: ActionArgument
    ): ActionArgumentPrimitive {
        switch (arg.type) {
            case ActionArgumentType.String:
                if (arg.enum && !arg.enum.includes(buf)) {
                    throw new CompletionFormatError(
                        `Invalid enum value for argument ${arg.name}: ${buf}`
                    )
                }
                return buf
            case ActionArgumentType.Number:
                const parsedNumber = parseInt(buf)
                if (isNaN(parsedNumber)) {
                    throw new CompletionFormatError(
                        `Invalid number format for argument ${arg.name}: ${buf}`
                    )
                }
                return parsedNumber
            case ActionArgumentType.Boolean:
                if (buf === 'true' || buf === '1') {
                    return true
                } else if (buf === 'false' || buf === '0') {
                    return false
                } else {
                    throw new CompletionFormatError(
                        `Invalid boolean format for argument ${arg.name}: ${buf}`
                    )
                }
            default:
                throw new CompletionFormatError(
                    `Unknown argument type ${arg.type} for argument ${arg.name}`
                )
        }
    }
}

export type Completion = {
    reasoning?: string
    action: CalledAction
}

export class CompletionFormatError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'CompletionFormatError'
    }
}
