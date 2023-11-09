/* eslint-disable no-case-declarations */

import { createSlice } from '@reduxjs/toolkit'

const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const initialState = anecdotesAtStart.map(asObject)

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
  initialState,
  reducers: {
    addAnecdote(state, action) {
      const content = action.payload
      state.push({
        content,
        id: getId()
      })
    },

    vote(state, action) {
      const id = action.payload
      const anecdoteToVote = state.find(a => a.id === id)
      const updatedAnecdote = {
        ...anecdoteToVote,
        votes: anecdoteToVote.votes + 1
      }
      const updatedAnecdotes = state.map(a => a.id === id ? updatedAnecdote : a)
      return sortByVotes(updatedAnecdotes)
    }
  }
})

export const { addAnecdote, vote } = anecdotesSlice.actions

export default anecdotesSlice.reducer