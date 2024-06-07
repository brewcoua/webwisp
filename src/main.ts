#!/usr/bin/env bun
import meow from 'meow'
import chalk from 'chalk'
import { config } from 'dotenv'
config({
    path: '.env',
    override: true,
})

import pkg from '../package.json'
import Agent from './Agent'
import Logger from './logger'

import { waitPress } from './cli/prompts'
import { promptTarget } from './cli/prompts/target'
import { promptTask } from './cli/prompts/task'

const cli = meow(
    `
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
`,
    {
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
    }
)

if (cli.flags.version) {
    console.log(pkg.version)
    process.exit(0)
}

if (cli.flags.verbose) {
    Logger.setVerbose(true)
}

function bindSignals(agent: Agent) {
    const terminate = async (code: number = 1) => {
        await agent.destroy()
        process.exit(code)
    }

    process.on('unhandledRejection', (reason, promise) => {
        Logger.error(`Unhandled Rejection: ${reason}`)
        terminate()
    })
    process.on('uncaughtException', (error) => {
        Logger.error(`Uncaught Exception: ${error}`)
        terminate()
    })
    ;['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGTERM'].forEach((signal) => {
        process.on(signal, () => {
            Logger.warn(`Received ${signal}, shutting down`)
            terminate(0)
        })
    })
}

async function main() {
    const target = await promptTarget(cli.flags.target)
    if (cli.flags.target) {
        Logger.prompt('Target', target)
    }

    const task = await promptTask(cli.flags.task, cli.flags.voice)
    if (cli.flags.task) {
        Logger.prompt('Task', task)
    }

    // Separate the target and task with a horizontal line
    const terminalWidth = process.stdout.columns || 80
    console.log(chalk.gray.bold('—'.repeat(terminalWidth)))

    const agent = new Agent()
    bindSignals(agent)

    await agent.initialize()

    await waitPress({ message: 'Press enter to start the task' })

    const result = await agent.spawn(target, task)

    await agent.destroy()
    Logger.taskResult(result)
}

main().catch(console.error)
