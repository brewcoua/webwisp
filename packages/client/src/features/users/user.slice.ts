import { UserProps } from '@domain/user.types'
import { createSlice } from '@reduxjs/toolkit'
import { AppDispatch } from '@store'
import { useAppSelector } from '@store/hooks'
import axios from 'axios'

export interface UserState extends UserProps {
    isLogged: boolean
}

const initialState: UserState = {
    isLogged: false,
    id: '',
    username: '',
    displayName: '',
    scopes: [],
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            const { id, username, displayName, scopes } = action.payload
            state.isLogged = true
            state.id = id
            state.username = username
            state.displayName = displayName
            state.scopes = scopes
        },
        clearUser: (state) => {
            state.isLogged = false
            state.id = ''
            state.username = ''
            state.displayName = ''
            state.scopes = []
        },
    },
})

export const { setUser, clearUser } = userSlice.actions

export const selectUser = (state: { user: UserState }) => state.user
export const useUser = () => useAppSelector(selectUser)

export default userSlice.reducer

// Thunks

export const fetchUser = () => async (dispatch: AppDispatch) => {
    try {
        const response = await axios.get('/api/auth/me')
        dispatch(userSlice.actions.setUser(response.data))
        return true
    } catch (err) {
        return false
    }
}

export const login =
    (username: string, password: string) => async (dispatch: AppDispatch) => {
        try {
            const response = await axios.post('/api/auth/login', {
                username,
                password,
            })
            localStorage.setItem('access-token', response.data.access_token)

            return await dispatch(fetchUser())
        } catch (err) {
            return false
        }
    }

export const signUp =
    (username: string, password: string) => async (dispatch: AppDispatch) => {
        try {
            await axios.post('/api/auth/signup', {
                username,
                password,
            })
            return await dispatch(login(username, password))
        } catch (err) {
            return false
        }
    }
