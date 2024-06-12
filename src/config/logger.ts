import { format } from 'winston'
import chalk from 'chalk'

import Action from '@/services/runner/domain/Action'
import ActionType from '@/services/runner/domain/ActionType'
import ActionStatus from '@/services/runner/domain/ActionStatus'
import TaskResult from '@/services/runner/domain/TaskResult'

export const TTYFormat = format.printf((info) => {
    if (info.action) {
        return ActionFormat(info.action, info.reasoning, info.duration)
    } else if (info.cycle) {
        return RetryFormat(info.message, info.cycle.current, info.cycle.max)
    } else if (info.result) {
        return ResultFormat(info.result)
    } else if (info.prompt) {
        return `${chalk.green('$')} ${chalk.whiteBright(info.prompt.title)} ${chalk.cyan(
            info.prompt.value
        )}`
    }

    // Standard message, rely on the log level to cleanly format with some colors
    const level = chalk.bold(FormatLevel(info.level))
    const sep = chalk.grey(':')

    return `${info.timestamp}${sep}${level}${sep}${chalk.white.bold(info.service)}${sep} ${info.message}`
})

const FormatLevel = (level: keyof typeof LevelMap) => {
    return LevelMap[level].format(
        (LevelMap[level].full || level)
            .toUpperCase()
            .padStart(
                Object.keys(LevelMap).reduce(
                    (acc, cur) =>
                        Math.max(
                            acc,
                            Math.max(
                                LevelMap[cur].full?.length || 0,
                                cur.length
                            )
                        ),
                    0
                )
            )
    )
}
const LevelMap: Record<
    string,
    {
        full?: string
        format: (s: string) => string
    }
> = {
    emerg: {
        full: 'emergency',
        format: (s: string) => chalk.redBright(s),
    },
    alert: {
        format: (s: string) => chalk.red(s),
    },
    crit: {
        full: 'critical',
        format: (s: string) => chalk.magentaBright(s),
    },
    error: {
        format: (s: string) => chalk.magenta(s),
    },
    warning: {
        format: (s: string) => chalk.yellow(s),
    },
    notice: {
        format: (s: string) => chalk.yellowBright(s),
    },
    info: {
        format: (s: string) => chalk.blue(s),
    },
    debug: {
        format: (s: string) => chalk.cyan(s),
    },
}

const ActionFormat = (
    action: Action,
    reasoning?: string,
    duration?: number
) => {
    // Use an emote to represent each action kind
    let emote
    switch (action.type) {
        case ActionType.Click:
            emote = '🖱️ '
            break
        case ActionType.Type:
            emote = '🖋️ '
            break
        case ActionType.PressEnter:
            emote = '⌨️ '
            break
        case ActionType.Scroll:
            emote = '📜'
            break
        case ActionType.Back:
            emote = '🔙'
            break
        case ActionType.Forward:
            emote = '🔜'
            break
        default:
            emote = '❓'
    }

    const buf = []

    // First, output the reasoning if any
    if (reasoning) {
        buf.push(`${chalk.bold.whiteBright(`🧠?`)} ${chalk.italic(reasoning)}`)
    }

    // Next, output the action itself
    buf.push(
        `${chalk.bold.whiteBright(`${emote}❯`)} ${chalk.white(action.description)} ${chalk.bold(
            action.status === ActionStatus.Success
                ? chalk.green('✔')
                : chalk.red('✘')
        )}${duration ? chalk.gray.italic(` (${duration}ms)`) : ''}`
    )

    // Finally, the raw command performed
    buf.push(
        `${chalk.greenBright('$')} ${chalk.whiteBright(action.type)} ${chalk.cyan(
            Object.values(action.arguments)
                .map((arg) => (typeof arg === 'string' ? `"${arg}"` : arg))
                .join(' ')
        )}`
    )

    return buf.join('\n') + '\n'
}

const RetryFormat = (message: string, cycle: number, max: number) => {
    return `${chalk.bold.whiteBright('🔁')} ${chalk.grey.italic(
        `${message} (${cycle}/${max})`
    )}`
}

const ResultFormat = (result: TaskResult) => {
    const buf = []
    buf.push(
        `${
            result.success
                ? chalk.green.bold('Done!')
                : chalk.red.bold('Failed!')
        } ${chalk.whiteBright(result.message)}`
    )

    if (result.value) {
        buf.push(
            `${chalk.whiteBright.bold('Value:')} ${chalk.cyan(result.value)}`
        )
    }

    return buf.join('\n')
}
