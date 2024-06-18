import Events from '../../../common/Events'
import RunnerProps from '@common/RunnerProps'
import { signal } from '@preact/signals'

export const Runners = signal<RunnerProps[]>([])

export const useRunners = (): RunnerProps[] => Runners.value

export const useRunner = (id: number): RunnerProps | undefined => {
    const runners = useRunners()
    return runners.find((runner) => runner.id === id)
}

export const addRunner = (runner: RunnerProps): void => {
    Runners.value = [...Runners.value, runner]
}

export const removeRunner = (id: number): void => {
    Runners.value = Runners.value.filter((runner) => runner.id !== id)
}

export const setRunnerStatus = (id: number, status: RunnerStatus): void => {
    console.log('Setting runner status:', id, status)
    Runners.value = Runners.value.map((runner) => {
        if (runner.id === id) {
            return {
                ...runner,
                status,
            }
        }
        return runner
    })
}

export const addRunnerAction = (id: number, action: ActionReport): void => {
    console.log('Adding runner action:', id, action)
    Runners.value = Runners.value.map((runner) => {
        if (runner.id === id) {
            return {
                ...runner,
                actions: [...runner.actions, action],
            }
        }
        return runner
    })
}

export const bindEvents = (): (() => void) => {
    electron.ipcRenderer.on(Events.RUNNER_ADDED, (_, runner: RunnerProps) => {
        addRunner(runner)
    })
    electron.ipcRenderer.on(Events.RUNNER_REMOVED, (_, id: number) => {
        removeRunner(id)
    })
    electron.ipcRenderer.on(
        Events.RUNNER_STATUS_CHANGED,
        (_, id: number, status: RunnerStatus) => {
            setRunnerStatus(id, status)
        }
    )
    electron.ipcRenderer.on(
        Events.RUNNER_ACTION,
        (_, id: number, action: ActionReport) => {
            addRunnerAction(id, action)
        }
    )

    return () => {
        electron.ipcRenderer.removeAllListeners(Events.RUNNER_ADDED)
        electron.ipcRenderer.removeAllListeners(Events.RUNNER_REMOVED)
        electron.ipcRenderer.removeAllListeners(Events.RUNNER_STATUS_CHANGED)
        electron.ipcRenderer.removeAllListeners(Events.RUNNER_ACTION)
    }
}
