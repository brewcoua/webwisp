import { TaskEvent, TaskEventType } from '@domain/task.events'
import { CreateTaskProps, TaskProps, TaskStatus } from '@domain/task.types'
import { signal } from '@preact/signals'
import { createSlice } from '@reduxjs/toolkit'
import { AppDispatch } from '@store'
import { useAppSelector } from '@store/hooks'
import { formatUrl } from '@store/query'
import axios from 'axios'

export interface TasksState {
    values: TaskProps[]
}

const initialState: TasksState = {
    values: [],
}

export const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        addTask: (state, action) => {
            // First, filter out any duplicate from the state
            state.values = state.values.filter(
                (task) => task.id !== action.payload.id
            )
            // Then add the new task
            state.values.push(action.payload)
            // Then sort the tasks by their updatedAt date
            state.values.sort((a, b) => {
                return (
                    new Date(b.updatedAt).getTime() -
                    new Date(a.updatedAt).getTime()
                )
            })
            return state
        },
        addTasks: (state, action) => {
            // First, filter out any duplicate from the state
            state.values = state.values.filter(
                (task) =>
                    !action.payload.some((t: TaskProps) => t.id === task.id)
            )
            // Then add the new tasks
            state.values.push(...action.payload)
            // Then sort the tasks by their updatedAt date
            state.values.sort((a, b) => {
                return (
                    new Date(b.updatedAt).getTime() -
                    new Date(a.updatedAt).getTime()
                )
            })
            return state
        },
        removeTask: (state, action) => {
            state.values.filter((task) => task.id !== action.payload)
            return state
        },
        addTaskCycle: (state, action) => {
            const task = state.values.find(
                (task) => task.id === action.payload.id
            )
            if (task) {
                task.cycles.push(action.payload.cycle)
            }
            return state
        },
        setTaskStatus: (state, action) => {
            const task = state.values.find(
                (task) => task.id === action.payload.id
            )
            if (task) {
                task.status = action.payload.status
            }
            return state
        },
        clearTaskCycles: (state, action) => {
            const task = state.values.find((task) => task.id === action.payload)
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
    removeTask,
    addTaskCycle,
    setTaskStatus,
    clearTaskCycles,
} = tasksSlice.actions

export const selectTasks = (state: { tasks: TasksState }) => state.tasks
export const useTask = (id: string) => {
    const tasks = useAppSelector(selectTasks)
    return tasks.values.find((task) => task.id === id)
}
export const useTasks = () => {
    return useAppSelector(selectTasks)
}

export default tasksSlice.reducer

// Thunks

export const fetchTasks = () => async (dispatch: AppDispatch) => {
    try {
        const response = await axios.get('/tasks', {
            params: {
                limit: 100,
            },
        })
        dispatch(addTasks(response.data.data))
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

export const createTaskGroup = (props: { name: string }) => async () => {
    try {
        const response = await axios.post('/tasks/group', props)
        return response.data
    } catch (err) {
        return null
    }
}

export const tasksEventSource = signal<EventSource | null>(null)
export const subscribeToTasks = () => async (dispatch: AppDispatch) => {
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

            switch (event.type) {
                case TaskEventType.QUEUED:
                    dispatch(addTask(event.task))
                    break
                case TaskEventType.REQUEUED:
                    dispatch(clearTaskCycles(event.id))
                    dispatch(
                        setTaskStatus({
                            id: event.id,
                            status: TaskStatus.PENDING,
                        })
                    )
                    break
                case TaskEventType.STARTED:
                    dispatch(addTask(event.task))
                    break
                case TaskEventType.CYCLE_COMPLETED:
                    dispatch(
                        addTaskCycle({ id: event.id, cycle: event.report })
                    )
                    break
                case TaskEventType.COMPLETED:
                    dispatch(addTask(event.task))
                    break
            }
        }

        tasksEventSource.value = eventSource

        return true
    } catch (err) {
        return false
    }
}
