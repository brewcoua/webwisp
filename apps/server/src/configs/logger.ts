import { createLogger, transports, format } from 'winston'
import chalk from 'chalk'

export default function makeLogger() {
    return createLogger({
        transports: [
            new transports.Console({
                level: process.env.LOG_LEVEL || 'info',
                format: prettyFormat,
            }),
            new transports.File({
                filename: 'logs/error.log',
                level: 'error',
                format: format.combine(format.timestamp(), format.json()),
            }),
            new transports.File({
                filename: 'logs/debug.log',
                level: 'debug',
                format: format.combine(format.timestamp(), format.json()),
            }),
        ],
    })
}

const PADDINGS = {
    level: 7,
    context: 20,
}

export const prettyFormat = format.combine(
    format.timestamp(),
    format.printf((info) => {
        const { timestamp, level, message, context, stack, ...rest } = info

        const sep = chalk.gray.bold(':')

        const levelBase = level.padStart(PADDINGS.level).toUpperCase()
        let levelStr
        switch (level) {
            case 'fatal':
                levelStr = chalk.red.bold(levelBase)
                break
            case 'error':
                levelStr = chalk.redBright.bold(levelBase)
                break
            case 'warn':
                levelStr = chalk.yellow.bold(levelBase)
                break
            case 'info':
                levelStr = chalk.blue.bold(levelBase)
                break
            case 'verbose':
                levelStr = chalk.green.bold(levelBase)
                break
            case 'debug':
                levelStr = chalk.magenta.bold(levelBase)
                break
            default:
                levelStr = chalk.white.bold(levelBase)
                break
        }

        const isError = level === 'error' || level === 'fatal'

        return `${chalk.gray(timestamp || new Date().toISOString())}${sep}${levelStr}${
            context ? sep + chalk.cyan(context.padStart(PADDINGS.context)) : ''
        }${sep} ${
            isError ? chalk.red(message) : message
        }${Object.keys(rest).length ? '\n' + JSON.stringify(rest, null, 2) : ''}${
            stack ? '\n' + chalk.gray.italic(stack) : ''
        }`
    })
)
