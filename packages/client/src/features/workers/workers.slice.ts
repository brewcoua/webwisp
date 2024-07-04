import { WorkerEvent, WorkerEventType } from '@domain/worker.events'
import { WorkerProps, WorkerStatus } from '@domain/worker.types'
import { signal } from '@preact/signals'
import { createSlice } from '@reduxjs/toolkit'
import { AppDispatch } from '@store'
import { useAppSelector } from '@store/hooks'
import axios from 'axios'

export type WorkersState = WorkerProps[]

const initialState: WorkersState = []

export const workersSlice = createSlice({
    name: 'workers',
    initialState,
    reducers: {
        addWorker: (state, action) => {
            // First, filter out any duplicate from the state
            state = state.filter((worker) => worker.id !== action.payload.id)
            // Then add the new worker
            state.push(action.payload)
            // Then sort the workers by their updatedAt date
            state.sort((a, b) => {
                return (
                    new Date(b.updatedAt).getTime() -
                    new Date(a.updatedAt).getTime()
                )
            })
        },
        addWorkers: (state, action) => {
            // First, filter out any duplicate from the state
            state = state.filter(
                (worker) =>
                    !action.payload.some((w: WorkerProps) => w.id === worker.id)
            )
            // Then add the new workers
            state.push(...action.payload)
            // Then sort the workers by their updatedAt date
            state.sort((a, b) => {
                return (
                    new Date(b.updatedAt).getTime() -
                    new Date(a.updatedAt).getTime()
                )
            })
        },
        removeWorker: (state, action) => {
            return state.filter((worker) => worker.id !== action.payload)
        },
        setWorkerStatus: (state, action) => {
            const worker = state.find(
                (worker) => worker.id === action.payload.id
            )
            if (worker) {
                worker.status = action.payload.status
            }
            return state
        },
        setWorkerTask: (state, action) => {
            const worker = state.find(
                (worker) => worker.id === action.payload.id
            )
            if (worker) {
                worker.task = action.payload.task
            }
            return state
        },
        clearWorkerTask: (state, action) => {
            const worker = state.find((worker) => worker.id === action.payload)
            if (worker) {
                worker.task = undefined
            }
            return state
        },
    },
})

export const {
    addWorker,
    addWorkers,
    removeWorker,
    setWorkerStatus,
    setWorkerTask,
    clearWorkerTask,
} = workersSlice.actions

export const selectWorkers = (state: { workers: WorkersState }) => state.workers

export const useWorker = (id: string) => {
    const workers = useAppSelector(selectWorkers)
    return workers.find((worker) => worker.id === id)
}
export const useWorkers = () => useAppSelector(selectWorkers)

export default workersSlice.reducer

// Thunks

export const fetchWorkers = () => async (dispatch: AppDispatch) => {
    try {
        const response = await axios.get('/api/workers')
        dispatch(addWorkers(response.data))
        return true
    } catch (err) {
        return false
    }
}

export const workersEventSource = signal<EventSource | null>(null)
export const subscribeToWorkers = () => async (dispatch: AppDispatch) => {
    try {
        const token = localStorage.getItem('access-token')
        if (!token) {
            return false
        }

        if (workersEventSource.value) {
            workersEventSource.value.close()
        }

        const eventSource = new EventSource(
            `/api/workers/subscribe?access_token=${encodeURIComponent(token)}`
        )

        eventSource.onmessage = (message) => {
            const event: WorkerEvent = JSON.parse(message.data)
            switch (event.type) {
                case WorkerEventType.STARTED:
                    dispatch(addWorker(event.worker))
                    break
                case WorkerEventType.DISCONNECTED:
                    dispatch(removeWorker(event.id))
                    break
                case WorkerEventType.STATUS_CHANGED:
                    dispatch(setWorkerStatus(event.status))
                    switch (event.status) {
                        case WorkerStatus.READY:
                            dispatch(clearWorkerTask(event.id))
                            break
                        case WorkerStatus.BUSY:
                            dispatch(setWorkerTask(event.task))
                            break
                    }
                    break
            }
        }

        workersEventSource.value = eventSource

        return true
    } catch (err) {
        return false
    }
}
