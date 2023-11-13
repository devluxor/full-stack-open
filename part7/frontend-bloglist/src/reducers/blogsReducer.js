import { createSlice } from '@reduxjs/toolkit'
import  blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    // vote(state, action) {
    //   const id = action.payload
    //   const toVote = state.find(s => s.id === id )
    //   const voted = { ...toVote, votes: toVote.votes + 1 }
    //   return state.map(s => s.id===id ? voted : s)
    // },
    // replaceAnecdote(state, action) {
    //   const replaced = action.payload
    //   return state.map(s => s.id===replaced.id ? replaced : s)
    // },
    addBlog(state, action) {
      state.push(action.payload)
    },
    setBlogs(state, action) {

      return action.payload
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
    const blog = await blogService.createNew(object)
    dispatch(addBlog(blog))
  }
}

// export const voteAnecdote = (object) => {
//   const toVote = { ...object, votes: object.votes + 1 }
//   return async dispatch => {
//     const anecdote = await anecdoteService.update(toVote)
//     dispatch(replaceAnecdote(anecdote))
//   }
// }

export const { setBlogs, addBlog } = blogSlice.actions
export default blogSlice.reducer