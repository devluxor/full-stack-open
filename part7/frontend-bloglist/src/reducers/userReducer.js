import { createSlice } from '@reduxjs/toolkit'

import loginService from '../services/login'
import blogService from '../services/blogs'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      const user = action.payload
      blogService.setToken(user.token)
      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))
      return user
    },
    clearUser(state, action) {
      window.localStorage.clear()
      return null
    }
  }
})

export const logUser = credentials => {
  return async dispatch => {
    try {
      const user = await loginService.login(credentials)
      dispatch(setUser(user))
      return user
    } catch (e) {
      throw Error(e)
    }
  }
}

export const { setUser, clearUser } = userSlice.actions

export default userSlice.reducer