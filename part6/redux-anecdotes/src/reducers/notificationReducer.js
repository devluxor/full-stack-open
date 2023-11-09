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
export default filterSlice.reducer