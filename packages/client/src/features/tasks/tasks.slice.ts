import { TaskEvent, TaskEventType } from '@domain/task.events'
import { CreateTaskProps, TaskProps, TaskStatus } from '@domain/task.types'
import { signal } from '@preact/signals'
import { createSlice } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from '@store'
import { useAppSelector } from '@store/hooks'
import { formatUrl } from '@store/query'
import axios from 'axios'
import { selectSelectedGroup } from './selected.slice'

export type TasksState = TaskProps[]

const initialState: TasksState = []

export const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        addTask: (state, action) => {
            // First, filter out any duplicate from the state
            state = state.filter((task) => task.id !== action.payload.id)
            // Then add the new task
            state.push(action.payload)
            // Then sort the tasks by their updatedAt date
            state.sort((a, b) => {
                return (
                    new Date(b.updatedAt).getTime() -
                    new Date(a.updatedAt).getTime()
                )
            })
            return state
        },
        addTasks: (state, action) => {
            // First, filter out any duplicate from the state
            state = state.filter(
                (task) =>
                    !action.payload.some((t: TaskProps) => t.id === task.id)
            )
            // Then add the new tasks
            state.push(...action.payload)
            // Then sort the tasks by their updatedAt date
            state.sort((a, b) => {
                return (
                    new Date(b.updatedAt).getTime() -
                    new Date(a.updatedAt).getTime()
                )
            })
            return state
        },
        setTasks: (state, action) => {
            return action.payload.sort((a: TaskProps, b: TaskProps) => {
                return (
                    new Date(b.updatedAt).getTime() -
                    new Date(a.updatedAt).getTime()
                )
            })
        },
        removeTask: (state, action) => {
            return state.filter((task) => task.id !== action.payload)
        },
        addTaskCycle: (state, action) => {
            const task = state.find((task) => task.id === action.payload.id)
            if (task) {
                task.cycles.push(action.payload.cycle)
            }
            return state
        },
        setTaskStatus: (state, action) => {
            const task = state.find((task) => task.id === action.payload.id)
            if (task) {
                task.status = action.payload.status
            }
            return state
        },
        clearTaskCycles: (state, action) => {
            const task = state.find((task) => task.id === action.payload)
            if (task) {
                task.cycles = []
            }
            return state
        },
    },
})

export const {
    addTask,
    addTasks,
    setTasks,
    removeTask,
    addTaskCycle,
    setTaskStatus,
    clearTaskCycles,
} = tasksSlice.actions

export const selectTasks = (state: { tasks: TasksState }) => state.tasks
export const useTask = (id: string) => {
    const tasks = useAppSelector(selectTasks)
    return tasks.find((task) => task.id === id)
}
export const useTasks = () => {
    return useAppSelector(selectTasks)
}

export default tasksSlice.reducer

// Thunks

export const fetchTasks = (group?: string) => async (dispatch: AppDispatch) => {
    try {
        const response = await axios.get('/tasks', {
            params: {
                limit: 100,
                group,
            },
        })
        dispatch(setTasks(response.data.data))
        return true
    } catch (err) {
        return false
    }
}

export const deleteTask = (id: string) => async (dispatch: AppDispatch) => {
    try {
        await axios.delete(`/tasks/${id}`)
        dispatch(removeTask(id))

        return true
    } catch (err) {
        return false
    }
}

export const createTask = (task: CreateTaskProps) => async () => {
    try {
        await axios.post('/tasks/create', task)
        return true
    } catch (err) {
        return false
    }
}

export const createTaskBulk = (tasks: CreateTaskProps[]) => async () => {
    try {
        await axios.post('/tasks/bulk', tasks)
        return true
    } catch (err) {
        return false
    }
}

export const tasksEventSource = signal<EventSource | null>(null)
export const subscribeToTasks =
    () => async (dispatch: AppDispatch, getState: () => RootState) => {
        try {
            const token = localStorage.getItem('access-token')
            if (!token) {
                return false
            }

            if (tasksEventSource.value) {
                tasksEventSource.value.close()
            }

            const eventSource = new EventSource(
                formatUrl(
                    `/tasks/subscribe?access_token=${encodeURIComponent(token)}`
                )
            )

            eventSource.onmessage = (message) => {
                const event: TaskEvent = JSON.parse(message.data)

                if (
                    [
                        TaskEventType.QUEUED,
                        TaskEventType.STARTED,
                        TaskEventType.COMPLETED,
                    ].includes(event.type)
                ) {
                    const task = (event as any).task as TaskProps
                    const group = selectSelectedGroup(getState())

                    if (
                        (!group && !task.group) ||
                        (group && task?.group === group.id)
                    ) {
                        dispatch(addTask(task))
                    }
                }

                switch (event.type) {
                    case TaskEventType.REQUEUED:
                        dispatch(clearTaskCycles(event.id))
                        dispatch(
                            setTaskStatus({
                                id: event.id,
                                status: TaskStatus.PENDING,
                            })
                        )
                        break
                    case TaskEventType.CYCLE_COMPLETED:
                        dispatch(
                            addTaskCycle({ id: event.id, cycle: event.report })
                        )
                        break
                }
            }

            tasksEventSource.value = eventSource

            return true
        } catch (err) {
            return false
        }
    }
