import chalk from 'chalk'

import Action from './services/runner/domain/Action'
import ActionType from './services/runner/domain/ActionType'
import TaskResult from './services/runner/domain/TaskResult'
import WebwispError from './domain/errors/Error'

export default class Logger {
    private static verbose = process.env.NODE_ENV === 'development'

    static setVerbose(verbose: boolean) {
        this.verbose = verbose
    }

    static debug(...message: any[]) {
        if (!this.verbose) return

        console.log(chalk.cyan.bold('DEBUG'), ...message)
    }

    static error(...message: any[]) {
        console.log(
            chalk.redBright.bold('ERROR'),
            ...message.map((m) => {
                if (m instanceof WebwispError) return chalk.red(m.full)
                return m
            })
        )
    }

    static warn(...message: any[]) {
        console.log(chalk.yellow.bold('WARN'), ...message)
    }

    static prompt(title: string, value: string) {
        // Simulate inquirer prompt format
        console.log(
            chalk.green('$'),
            chalk.whiteBright.bold(title),
            chalk.reset.cyan(value)
        )
    }

    static action(
        action: Action,
        reasoning?: string,
        duration?: number,
        meta?: any
    ) {
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

        // First, output the reasoning if any
        if (reasoning) {
            console.log(chalk.bold.whiteBright(`🧠?`), chalk.italic(reasoning))
        }

        const usage = meta && meta.usage ? meta.usage.total : null

        console.log(
            chalk.bold.whiteBright(`${emote}❯`),
            chalk.white(action.description),
            chalk.bold(action.status ? chalk.green('✔') : chalk.red('✘')),
            // Duration
            duration && chalk.gray.italic(`(${duration}ms)`),
            // Usage
            usage && chalk.gray.italic(`[${usage} tok]`)
        )

        console.log(
            chalk.greenBright('$'),
            chalk.whiteBright(action.type),
            chalk.cyan(
                Object.values(action.arguments).map((arg) =>
                    typeof arg === 'string' ? `"${arg}"` : arg
                )
            ),
            '\n'
        )
    }

    static taskResult(result: TaskResult) {
        console.log(
            result.success
                ? chalk.green.bold('Done!')
                : chalk.red.bold('Failed!'),
            chalk.whiteBright(result.message)
        )
        if (result.value) {
            console.log(
                chalk.whiteBright.bold('Value:'),
                chalk.cyan(result.value)
            )
        }
    }
}
