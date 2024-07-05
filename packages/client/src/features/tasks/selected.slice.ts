import { TaskGroupProps } from '@domain/group.types'
import { TaskProps } from '@domain/task.types'
import { createSlice } from '@reduxjs/toolkit'
import { AppDispatch } from '@store'
import { useAppSelector } from '@store/hooks'
import axios from 'axios'

export interface SelectedState {
    task?: TaskProps & { trace_url?: string }
    group?: TaskGroupProps
    display?: 'task' | 'group'
}

const initialState: SelectedState = {}

export const selectedSlice = createSlice({
    name: 'selected',
    initialState,
    reducers: {
        selectTask: (state, action) => {
            state.task = action.payload
            return state
        },
        selectGroup: (state, action) => {
            state.group = action.payload
            return state
        },
        clearTask: (state) => {
            state.task = undefined
            return state
        },
        clearGroup: (state) => {
            state.group = undefined
            return state
        },
        setSelectedTraceUrl: (state, action) => {
            if (state.task) {
                state.task.trace_url = action.payload
            }
            return state
        },
        setDisplay: (state, action) => {
            state.display = action.payload
            return state
        },
    },
})

export const {
    selectTask,
    selectGroup,
    clearTask,
    clearGroup,
    setSelectedTraceUrl,
    setDisplay,
} = selectedSlice.actions

export const selectSelected = (state: { selected: SelectedState }) =>
    state.selected
export const selectSelectedTask = (state: { selected: SelectedState }) =>
    state.selected.task
export const selectSelectedGroup = (state: { selected: SelectedState }) =>
    state.selected.group
export const selectSelectedDisplay = (state: { selected: SelectedState }) =>
    state.selected.display

export const useSelected = () => useAppSelector(selectSelected)
export const useSelectedTask = () => useAppSelector(selectSelectedTask)
export const useSelectedGroup = () => useAppSelector(selectSelectedGroup)
export const useSelectedDisplay = () => useAppSelector(selectSelectedDisplay)

export default selectedSlice.reducer

// Thunks

export const queryTaskTrace = (id: string) => async (dispatch: AppDispatch) => {
    try {
        const response = await axios.get(`/tasks/trace/${id}`)
        dispatch(setSelectedTraceUrl(response.data.url))
        return true
    } catch (err) {
        return false
    }
}
