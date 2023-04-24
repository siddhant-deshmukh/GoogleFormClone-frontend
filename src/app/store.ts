import { configureStore } from '@reduxjs/toolkit'
import formReducer from '../features/form/formSlice'
import msgsReducer from '../features/msgs/msgSlice'

const store =  configureStore({
  reducer: {
    form : formReducer,
    msgs : msgsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store