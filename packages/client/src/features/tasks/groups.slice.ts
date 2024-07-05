import { CreateTaskGroupProps, TaskGroupProps } from '@domain/group.types'
import { createSlice } from '@reduxjs/toolkit'
import { AppDispatch } from '@store'
import { useAppSelector } from '@store/hooks'
import axios from 'axios'

export type GroupsState = TaskGroupProps[]

const initialState: GroupsState = []

export const groupsSlice = createSlice({
    name: 'groups',
    initialState,
    reducers: {
        addGroup: (state, action) => {
            state.push(action.payload)
        },
        addGroups: (state, action) => {
            state.push(...action.payload)
            state = state.filter(
                (group, index, self) =>
                    index === self.findIndex((g) => g.id === group.id)
            )
        },
    },
})

export const { addGroup, addGroups } = groupsSlice.actions

export const selectGroups = (state: { groups: GroupsState }) => state.groups
export const selectGroup = (id: string) => (state: { groups: GroupsState }) =>
    state.groups.find((group) => group.id === id)

export const useGroups = () => useAppSelector(selectGroups)
export const useGroup = (id: string) => useAppSelector(selectGroup(id))

export default groupsSlice.reducer

// Thunks

export const fetchGroups = () => async (dispatch: AppDispatch) => {
    try {
        const response = await axios.get('/tasks/groups', {
            params: {
                limit: 100,
            },
        })
        dispatch(addGroups(response.data.data))
        return true
    } catch (err) {
        return false
    }
}

export const createGroup =
    (props: CreateTaskGroupProps) => async (dispatch: AppDispatch) => {
        try {
            const response = await axios.post('/tasks/groups', props)
            dispatch(addGroup(response.data))
            return response.data.id
        } catch (err) {
            return null
        }
    }
