import config from '../runner/RunnerConfig'
import AbstractAction from '../runner/domain/AbstractAction'
import AbstractArgument, {
    AbstractArgumentPrimitive,
    AbstractArgumentType,
} from '../runner/domain/AbstractArgument'
import Action, { ActionArguments } from '../runner/domain/Action'
import ActionStatus from '../runner/domain/ActionStatus'
import ActionType from '../runner/domain/ActionType'
import { GenerationResult, GenerationStatus } from './domain/GenerationResult'

const RAW_ACTION_REGEX = /~~~([^]*)~~~/

export default class MindParser {
    public parse<T>(result: string, meta?: T): GenerationResult<T> {
        const rawAction = result.match(RAW_ACTION_REGEX)
        if (!rawAction) {
            return {
                status: GenerationStatus.Invalid,
            }
        }

        const action = this.parseAction(rawAction[1].trim())
        if (!action) {
            return {
                status: GenerationStatus.Invalid,
            }
        }

        const reasoning = result
            .split('## Action ##')
            .at(1)
            ?.split('~~~')
            .at(0)
            ?.trim()

        return {
            status: GenerationStatus.Success,
            action,
            reasoning,
            meta,
        }
    }

    private parseAction(action: string): Action | null {
        const lines = action.split('\n')

        if (lines.length !== 2) {
            return null
        }

        const description = lines[0].trim()
        if (
            !description ||
            !description.startsWith('$ ') ||
            description.length < 3
        ) {
            return null
        }

        const actionLine = lines[1].trim()
        if (!actionLine) {
            return null
        }

        const actionType = actionLine.split(' ')[0] as ActionType
        const actionInfo = config.actions[actionType]
        if (!actionInfo) {
            return null
        }

        const args = actionLine.substring(actionType.length).trim()
        const parsedArgs = this.parseArgs(args, actionType, actionInfo)
        if (!parsedArgs) {
            return null
        }

        return {
            status: ActionStatus.Pending,
            type: actionType,
            description: description.substring(2),
            arguments: parsedArgs,
        }
    }

    private parseArgs(
        args: string,
        type: ActionType,
        action: AbstractAction
    ): ActionArguments | null {
        const parsedArgs = {} as ActionArguments
        if (!action.arguments) {
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

                const currentArg = action.arguments[count]
                const parsed = this.parseArg(buf, currentArg)
                if (parsed === null) {
                    return null
                }

                parsedArgs[currentArg.name] = parsed

                buf = ''
                count++

                if (count > action.arguments.length) {
                    break // Too many arguments, for the sake of flexibility we'll just ignore them
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
                    return null // Invalid escape character
                }
                cursor++
                continue
            }

            buf += char
            cursor++
        }

        if (buf) {
            const currentArg = action.arguments[count]
            const parsed = this.parseArg(buf, currentArg)
            if (parsed === null) {
                return null
            }

            parsedArgs[currentArg.name] = parsed
            count++
        }

        // See if we're missing any required arguments
        const requiredArgs =
            action.arguments?.filter((arg) => arg.required) || []
        if (requiredArgs.length > count) {
            return null // Missing required arguments
        }

        return parsedArgs
    }

    private parseArg(
        buf: string,
        argument: AbstractArgument
    ): AbstractArgumentPrimitive | null {
        switch (argument.type) {
            case AbstractArgumentType.String:
                if (argument.enum && !argument.enum.includes(buf)) {
                    return null // Bad enum
                }
                return buf
            case AbstractArgumentType.Number: {
                const parsedNumber = parseInt(buf)
                if (isNaN(parsedNumber)) {
                    return null // Bad number
                }
                return parsedNumber
            }
            case AbstractArgumentType.Boolean:
                if (buf === 'true' || buf === '1') {
                    return true
                } else if (buf === 'false' || buf === '0') {
                    return false
                } else {
                    return null // Bad boolean
                }
            default:
                return null // Unknown argument type
        }
    }
}
