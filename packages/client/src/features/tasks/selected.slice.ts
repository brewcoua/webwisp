import { TaskProps, TaskStatus } from '@domain/task.types'
import { createSlice } from '@reduxjs/toolkit'
import { AppDispatch } from '@store'
import { useAppSelector } from '@store/hooks'
import axios from 'axios'

export interface SelectedTaskState extends TaskProps {
    trace_url?: string
}

const initialState: SelectedTaskState = {
    id: '',
    createdAt: '',
    updatedAt: '',

    target: '',
    prompt: '',

    status: TaskStatus.PENDING,
    cycles: [],
}

export const selectTaskSlice = createSlice({
    name: 'selected_task',
    initialState,
    reducers: {
        selectTask: (state, action) => {
            return action.payload
        },
        clearTask: (state) => {
            return initialState
        },
        setTraceUrl: (state, action) => {
            state.trace_url = action.payload
        },
    },
})

export const { selectTask, clearTask, setTraceUrl } = selectTaskSlice.actions

export const selectSelectedTask = (state: {
    selected_task: SelectedTaskState
}) => state.selected_task
export const useSelectedTask = () => useAppSelector(selectSelectedTask)

export default selectTaskSlice.reducer

// Thunks

export const queryTaskTrace = (id: string) => async (dispatch: AppDispatch) => {
    try {
        const response = await axios.get(`/tasks/trace/${id}`)
        dispatch(setTraceUrl(response.data.url))
        return true
    } catch (err) {
        return false
    }
}
