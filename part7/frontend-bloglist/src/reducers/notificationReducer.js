import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    // these set the state: their return value sets the state
    set(state, action) {
      return action.payload
    },
    clear(state, action) {
      return null
    }
  }
})

export const setNotification = (notification, delay) => {

  return async dispatch => {
    dispatch(set(notification))
    setTimeout(() => dispatch(clear()), delay)
  }
}

export const { set, clear } = notificationSlice.actions
export default notificationSlice.reducer