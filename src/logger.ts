import chalk from 'chalk'
import { ActionType } from './constants'
import { TaskResult } from './agent/runner/RunnerTask'

export class Logger {
    private static verbose = process.env.NODE_ENV === 'development'

    static setVerbose(verbose: boolean) {
        this.verbose = verbose
    }

    static debug(message: string) {
        if (!this.verbose) return

        console.log(chalk.cyan.bold('DEBUG'), message)
    }

    static error(message: string) {
        console.log(chalk.red.bold('ERROR'), message)
    }

    static warn(message: string) {
        console.log(chalk.yellow.bold('WARN'), message)
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
        kind: ActionType,
        action: string,
        success: boolean,
        reasoning?: string,
        duration?: number,
        usage?: number
    ) {
        // Use an emote to represent each action kind
        let emote
        switch (kind) {
            case ActionType.Click:
                emote = '🖱️ '
                break
            case ActionType.Type:
                emote = '🖋️ '
                break
            case ActionType.PressEnter:
                emote = '⌨️ '
                break
            case ActionType.ScrollDown:
            case ActionType.ScrollUp:
                emote = '📜'
                break
            default:
                emote = '❓'
        }

        // First, output the reasoning if any
        if (reasoning) {
            console.log(chalk.bold.whiteBright(`🧠?`), chalk.italic(reasoning))
        }

        console.log(
            chalk.bold.whiteBright(`${emote}❯`),
            chalk.white(action),
            chalk.bold(success ? chalk.green('✔') : chalk.red('✘')),
            // Duration
            duration && chalk.gray.italic(`(${duration}ms)`),
            // Usage
            usage && chalk.gray.italic(`[${usage} tok]`)
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
