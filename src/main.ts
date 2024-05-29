#!/usr/bin/env bun
import meow from 'meow'
import { input } from '@inquirer/prompts'
import chalk from 'chalk'

import pkg from '../package.json'
import { REGEX } from './constants'
import { Agent } from './agent'
import { Logger } from './logger'

const cli = meow(`
    Usage
      $ webwisp

    Options
      --version, -V     Show version number
      --verbose         Show verbose output
      --target, -t      The target URL to run the agent on (if not provided, will prompt for input)
      --task, -k        The task to run on the target URL (if not provided, will prompt for input)
      --voice, -v       Whether to use voice recognition for input (overriden if both target and task are provided)

    Examples
      $ webwisp -V
      ${pkg.version}
      $ webwisp --target https://example.com --task "Give me the contact email address"
`, {
    importMeta: import.meta,
    flags: {
        version: {
            type: 'boolean',
            shortFlag: 'V',
        },
        verbose: {
            type: 'boolean',
        },
        target: {
            type: 'string',
            shortFlag: 't',
        },
        task: {
            type: 'string',
            shortFlag: 'k',
        },
        voice: {
            type: 'boolean',
            shortFlag: 'v',
        },
    },
})

if (cli.flags.version) {
    console.log(pkg.version)
    process.exit(0)
}

if (cli.flags.verbose) {
    Logger.setVerbose(true)
}

async function promptTarget() {
    const target = await input({
        message: 'Target',
        validate: (input: string) => {
            if (
                input.match(REGEX.url) ||
                input.match(REGEX.domain) ||
                input.match(REGEX.ip) ||
                input.match(REGEX.localhost)
            ) {
                return true
            }

            return 'Invalid URL, domain name, or IP address'
        },
        transformer: (input: string) => {
            // If it starts with http or https, return as is
            if (input.match(/^https?:\/\//i)) {
                return input
            }

            if (input.match(REGEX.domain)) {
                return `https://${input}`
            }

            return `http://${input}`
        },
    })

    if (target.match(REGEX.url)) {
        return target
    }

    if (target.match(REGEX.domain)) {
        return `https://${target}`
    }

    return `http://${target}`
}

async function promptTask() {
    return input({
        message: 'Task',
        validate: (input: string) => {
            // Check that task must have a few words
            if (input.split(' ').length >= 3) {
                return true
            }

            return 'Task must have at least 3 words'
        },
    })
}

function bindSignals(agent: Agent) {
    const terminate = async (code: number = 1) => {
        await agent.destroy()
        process.exit(code)
    }

    process.on('unhandledRejection', (reason, promise) => {
        Logger.error(`Unhandled Rejection: ${reason}`);
        terminate();
    })
    process.on('uncaughtException', error => {
        Logger.error(`Uncaught Exception: ${error}`);
        terminate();
    });

    ['SIGHUP', 'SIGINT', 'SIGKILL', 'SIGQUIT', 'SIGTERM'].forEach(signal => {
        process.on(signal, () => {
            Logger.warn(`Received ${signal}, shutting down`);
            terminate(0)
        })
    })
}

async function main() {
    let target = cli.flags.target
    if (!target) {
        target = await promptTarget()
    } else {
        Logger.prompt('Target', target)
    }

    let task = cli.flags.task
    if (!task) {
        task = await promptTask()
    } else {
        Logger.prompt('Task', task)
    }

    // Separate the target and task with a horizontal line
    const terminalWidth = process.stdout.columns || 80
    console.log(chalk.gray.bold('—'.repeat(terminalWidth)))

    const agent = new Agent()
    bindSignals(agent);

    await agent.initialize()
    const result = await agent.spawn_task(target, task)

    await agent.destroy()
    Logger.taskResult(result)
}

main()
    .catch(console.error)