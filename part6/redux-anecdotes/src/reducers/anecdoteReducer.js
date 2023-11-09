/* eslint-disable no-case-declarations */

import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

// const getId = () => (100000 * Math.random()).toFixed(0)


// const reducer = (state = initialState, action) => {
//   switch(action.type) {
//     case 'NEW_ANECDOTE':
//       return sortByVotes([...state, action.payload])
//     case 'VOTE':
//       const id = action.payload.id
//       const anecdoteToVote = state.find(a => a.id === id)
//       const updatedAnecdote = {
//         ...anecdoteToVote,
//         votes: anecdoteToVote.votes + 1
//       }
//       const updatedAnecdotes = state.map(a => a.id === id ? updatedAnecdote : a)
//       return sortByVotes(updatedAnecdotes)
//     default:
//       return state
//     }
// }

const sortByVotes = anecdotes => {
  return anecdotes.sort((a, b) => b.votes - a.votes)
}

// action creators:
// export const addAnecdote = content => {
//   return {
//     type: 'NEW_ANECDOTE',
//     payload: {
//       content,
//       votes: 0,
//       id: getId()
//     }
//   }
// }

// export const vote = (id) => {
//   return {
//     type: 'VOTE',
//     payload: { id }
//   }
// }

// export default reducer

const anecdotesSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    vote(state, action) {
      const id = action.payload
      const anecdoteToVote = state.find(a => a.id === id)
      const updatedAnecdote = {
        ...anecdoteToVote,
        votes: anecdoteToVote.votes + 1
      }
      const updatedAnecdotes = state.map(a => a.id === id ? updatedAnecdote : a)
      return sortByVotes(updatedAnecdotes)
    },

    appendAnecdote(state, action) {
      state.push(action.payload)
    },

    setAnecdotes(state, action) {
      const sortedAnecdotes = sortByVotes(action.payload)
      return sortedAnecdotes
    }
  }
})

export const {vote, appendAnecdote, setAnecdotes } = anecdotesSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteAnecdote = anecdote => {
  return async dispatch => {
    await anecdoteService.updateVotes(anecdote)
    dispatch(vote(anecdote.id))
  }
}

export default anecdotesSlice.reducer