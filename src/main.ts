#!/usr/bin/env node
import chalk from 'chalk'
import { config } from 'dotenv'
config({
    path: '.env',
    override: true,
})

import Agent from './Agent'
import Logger from './logger'

import { waitPress, promptTarget, promptTask } from './cli/prompts'
import { getConfig } from './cli/config'
import { bindSignals } from './cli/utils'

async function main() {
    const cli = getConfig()

    const target = await promptTarget(cli.target)
    if (cli.target) {
        Logger.prompt('Target', target)
    }

    const task = await promptTask(cli.task, cli.voice)
    if (cli.task) {
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
