import userReducer from '@features/users/user.slice'
import tasksReducer from '@features/tasks/tasks.slice'
import groupsReducer from '@features/tasks/groups.slice'
import selectedReducer from '@features/tasks/selected.slice'
import workersReducer from '@features/workers/workers.slice'

import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({
    reducer: {
        user: userReducer,
        tasks: tasksReducer,
        groups: groupsReducer,
        selected: selectedReducer,
        workers: workersReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
