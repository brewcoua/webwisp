#!/usr/bin/env node
import chalk from 'chalk'
import { config } from 'dotenv'
config({
    path: '.env',
    override: true,
})

import Agent from './Agent'

import { waitPress, promptTarget, promptTask } from './cli/prompts'
import { getConfig } from './cli/config'
import { bindSignals } from './cli/utils'

async function main() {
    const cli = getConfig()

    const agent = new Agent()
    bindSignals(agent)

    if (cli.verbose) {
        agent._logger.level = 'debug'
    }

    const target = await promptTarget(cli.target)
    if (cli.target) {
        agent._logger.info('Prefilled target', {
            prompt: {
                title: 'Target',
                value: target,
            },
        })
    }

    const task = await promptTask(cli.task, cli.voice)
    if (cli.task) {
        agent._logger.info('Prefilled task', {
            prompt: {
                title: 'Task',
                value: task,
            },
        })
    }

    // Separate the target and task with a horizontal line
    if (process.stdout.isTTY) {
        const terminalWidth = process.stdout.columns || 80
        console.log(chalk.gray.bold('—'.repeat(terminalWidth)))
    }

    await agent.initialize()

    if (process.stdout.isTTY)
        await waitPress({ message: 'Press enter to start the task' })

    const result = await agent.spawn(target, task)

    await agent.destroy()
    agent._logger.info('Task completed', { result })
}

main().catch(console.error)
