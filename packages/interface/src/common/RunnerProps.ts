import type { ActionReport, RunnerStatus } from '@webwisp/lib'

export type RunnerProps = {
  id: number
  status: RunnerStatus
  target: string
  task: string
  remoteUrl: string
  actions: ActionReport[]
}
export default RunnerProps
