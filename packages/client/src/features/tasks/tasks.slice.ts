import { TaskEvent, TaskEventType } from '@domain/task.events'
import { TaskProps, TaskStatus } from '@domain/task.types'
import { signal } from '@preact/signals'
import { createSlice } from '@reduxjs/toolkit'
import { AppDispatch } from '@store'
import { useAppSelector } from '@store/hooks'
import axios from 'axios'

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

export const fetchTasks = () => async (dispatch: AppDispatch) => {
    try {
        const response = await axios.get('/api/tasks', {
            params: {
                limit: 100,
            },
        })
        dispatch(addTask(response.data))
        return true
    } catch (err) {
        return false
    }
}

export const deleteTask = (id: string) => async (dispatch: AppDispatch) => {
    try {
        await axios.delete(`/api/tasks/${id}`)
        dispatch(removeTask(id))

        return true
    } catch (err) {
        return false
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
            `/api/tasks/subscribe?access_token=${encodeURIComponent(token)}`
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
