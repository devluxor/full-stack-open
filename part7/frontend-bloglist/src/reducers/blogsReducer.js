import { createSlice } from '@reduxjs/toolkit'
import  blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    likeBlog(state, action) {
      const id = action.payload
      const toLike = state.find(s => s.id === id )
      const liked = { ...toLike, likes: toLike.likes + 1 }
      return state.map(b => b.id === id ? liked : b )
    },
    removeBlog(state, action) {
      const id = action.payload.id
      return state.filter(b => b.id !== id )
    },
    addBlog(state, action) {
      state.push(action.payload)
    },
    setBlogs(state, action) {
      return action.payload.sort((a, b) => b.likes - a.likes)
    }
  },
})

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (object) => {
  return async dispatch => {
    try {
      const blog = await blogService.createBlog(object)
      dispatch(addBlog(blog))
    } catch(e) {
      throw Error(e)
    }
  }
}

export const deleteBlog = (object) => {
  return async dispatch => {
    await blogService.deleteBlog(object)
    dispatch(removeBlog(object))
  }
}

export const addLikeBlog = (blog) => {
  const toLike = { ...blog, likes: blog.likes + 1 }
  return async dispatch => {
    const liked = await blogService.updateBlog(toLike)
    dispatch(likeBlog(liked.id))
  }
}

export const { setBlogs, addBlog, removeBlog, likeBlog } = blogSlice.actions
export default blogSlice.reducer