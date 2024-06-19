import ActionType from '@domain/ActionType'
import ParsedResult, {
    ParseError,
    ParsedAction,
    ParsedArgument,
    ParsedArguments,
} from './domain/ParsedResult'
import config from 'src/worker.config'

import ActionStatus from '@domain/ActionStatus'
import AbstractAction from '@domain/AbstractAction'
import { ActionArguments } from '@domain/Action'
import AbstractArgument, {
    AbstractArgumentType,
} from '@domain/AbstractArgument'

const RAW_ACTION_REGEX = /~~~([^]*)~~~/

export default class MindParser {
    public parse(result: string): ParsedResult | ParseError {
        const rawAction = result.match(RAW_ACTION_REGEX)
        if (!rawAction) {
            return {
                success: false,
                error: 'No action found',
            }
        }

        const action = this.parseAction(rawAction[1].trim())
        if (!action.success) {
            return {
                success: false,
                error: 'Invalid action',
            }
        }

        const reasoning = result
            .split('## Action ##')
            .at(1)
            ?.split('~~~')
            .at(0)
            ?.trim()

        return {
            success: true,
            action: action.action,
            reasoning,
        }
    }

    private parseAction(action: string): ParsedAction | ParseError {
        const lines = action.split('\n')

        if (lines.length !== 2) {
            return {
                success: false,
                error: `Line count mismatch (expected 2, got ${lines.length})`,
            }
        }

        const description = lines[0].trim()
        if (
            !description ||
            !description.startsWith('$ ') ||
            description.length < 3
        ) {
            return {
                success: false,
                error: 'Invalid description, must start with "$ "',
            }
        }

        const actionLine = lines[1].trim()
        if (!actionLine) {
            return {
                success: false,
                error: 'No action line found',
            }
        }

        const actionType = actionLine.split(' ')[0] as ActionType
        const actionInfo = config.actions[actionType]
        if (!actionInfo) {
            return {
                success: false,
                error: `Unknown action type: ${actionType}`,
            }
        }

        const args = actionLine.substring(actionType.length).trim()
        const parsedArgs = this.parseArgs(args, actionInfo)
        if (!parsedArgs.success) {
            return {
                success: false,
                error: 'Failed to parse arguments:\n' + parsedArgs.error,
            }
        }

        return {
            success: true,
            action: {
                status: ActionStatus.Pending,
                type: actionType,
                description: description.substring(2),
                arguments: parsedArgs.arguments,
            },
        }
    }

    private parseArgs(
        args: string,
        action: AbstractAction
    ): ParsedArguments | ParseError {
        const parsedArgs = {} as ActionArguments
        if (!action.arguments) {
            return {
                success: true,
                arguments: parsedArgs,
            }
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
                if (!currentArg) {
                    break // Too many arguments, for the sake of flexibility we'll just ignore them
                }

                const parsed = this.parseArg(buf, currentArg)
                if (!parsed.success) {
                    return {
                        success: false,
                        error: `Failed to parse argument:\n${parsed.error}`,
                    }
                }

                parsedArgs[currentArg.name] = parsed.argument

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
                    return {
                        success: false,
                        error: `Invalid escape character at position ${cursor}`,
                    }
                }
                cursor++
                continue
            }

            buf += char
            cursor++
        }

        if (buf) {
            const currentArg = action.arguments[count]
            if (currentArg) {
                const parsed = this.parseArg(buf, currentArg)
                if (!parsed.success) {
                    return {
                        success: false,
                        error: `Failed to parse argument:\n${parsed.error}`,
                    }
                }

                parsedArgs[currentArg.name] = parsed.argument
                count++
            }
        }

        // See if we're missing any required arguments
        const requiredArgs =
            action.arguments?.filter((arg) => arg.required) || []
        if (requiredArgs.length > count) {
            return {
                success: false,
                error: `Missing required arguments: ${requiredArgs
                    .slice(count)
                    .map((arg) => arg.name)
                    .join(', ')}`,
            }
        }

        return {
            success: true,
            arguments: parsedArgs,
        }
    }

    private parseArg(
        buf: string,
        argument: AbstractArgument
    ): ParsedArgument | ParseError {
        switch (argument.type) {
            case AbstractArgumentType.String:
                if (argument.enum && !argument.enum.includes(buf)) {
                    return {
                        success: false,
                        error: `Invalid enum value, got ${buf}, expected ${argument.enum.join(', ')}`,
                    }
                }
                return {
                    success: true,
                    argument: buf,
                }
            case AbstractArgumentType.Number: {
                const parsedNumber = parseInt(buf)
                if (isNaN(parsedNumber)) {
                    return {
                        success: false,
                        error: 'Failed to parse number',
                    }
                }
                return {
                    success: true,
                    argument: parsedNumber,
                }
            }
            case AbstractArgumentType.Boolean:
                let val
                if (buf === 'true' || buf === '1') {
                    val = true
                } else if (buf === 'false' || buf === '0') {
                    val = false
                } else {
                    return {
                        success: false,
                        error: 'Failed to parse boolean',
                    }
                }
                return {
                    success: true,
                    argument: val,
                }
            default:
                return {
                    success: false,
                    error: 'Unknown argument type',
                }
        }
    }
}
