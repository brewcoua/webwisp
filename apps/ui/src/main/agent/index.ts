import { BrowserWindow, ipcMain } from 'electron'
import { loadCredentials } from './credentials'
import { Agent, ActionReport, RunnerStatus } from '@webwisp/lib'
import { RunnerProps } from '@common/RunnerProps'
import Events from '../../common/Events'

export default async function launchAgent(window: BrowserWindow): Promise<void> {
  // First, load credentials
  const credentials = await loadCredentials(window)

  // Now set them as env
  process.env.OPENAI_API_KEY = credentials.apiKey
  process.env.OPENAI_ORG = credentials.organizationId
  process.env.OPENAI_PROJECT = credentials.projectId

  // Finally, startup the agent
  console.log('Launching agent')
  const agent = new Agent()
  await agent.initialize()
  console.log('Agent initialized')

  ipcMain.on(Events.RUNNER_SPAWN, async (_, target: string, task: string) => {
    const runner = await agent.spawn(target, task)
    const remoteUrl = await runner.page.getRemoteDebuggingUrl()

    if (!remoteUrl) {
      throw new Error('Failed to get remote debugging url')
    }

    const props: RunnerProps = {
      id: runner.id,
      status: runner.status,
      target,
      task,
      remoteUrl,
      actions: []
    }

    console.log('Runner spawned:', props)
    window.webContents.send(Events.RUNNER_ADDED, props)

    runner.on('status', (status: RunnerStatus) => {
      window.webContents.send(Events.RUNNER_STATUS_CHANGED, runner.id, status)
    })
    runner.on('action', (action: ActionReport) => {
      window.webContents.send(Events.RUNNER_ACTION, runner.id, action)
    })

    await runner.run()
  })
}
