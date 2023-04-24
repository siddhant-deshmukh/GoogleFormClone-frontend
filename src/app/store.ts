import { configureStore } from '@reduxjs/toolkit'
import formReducer from '../features/form/formSlice'
import msgsReducer from '../features/msgs/msgSlice'

export default configureStore({
  reducer: {
    form : formReducer,
    msgs : msgsReducer,
  },
})