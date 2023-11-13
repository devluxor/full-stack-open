import { configureStore } from '@reduxjs/toolkit'

import notificationReducer from './reducers/notificationReducer'
import blogsReducer from './reducers/blogsReducer'

const store = configureStore({
  reducer: {
    blogs: blogsReducer,
    notification: notificationReducer
  }
})

export default store