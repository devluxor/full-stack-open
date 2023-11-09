import { createSlice } from "@reduxjs/toolkit"

const filterSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    displayNotification(state, action) {
      return action.payload
    },

    removeNotification() {
      return ''
    }
  }
})


export const {displayNotification, removeNotification} = filterSlice.actions

export const setNotification = (message, seconds) => {
  return async dispatch => {
    dispatch(displayNotification(message))
    setTimeout(() => dispatch(removeNotification()), seconds * 1000)
  }
}

export default filterSlice.reducer