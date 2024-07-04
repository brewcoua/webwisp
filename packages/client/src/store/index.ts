import userReducer from '@features/users/user.slice'
import tasksReducer from '@features/tasks/tasks.slice'
import selectedTaskReducer from '@features/tasks/selected.slice'
import workersReducer from '@features/workers/workers.slice'

import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({
    reducer: {
        user: userReducer,
        tasks: tasksReducer,
        selected_task: selectedTaskReducer,
        workers: workersReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
