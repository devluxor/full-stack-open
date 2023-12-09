/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  // these two give access to the store (now managed by super-parent Provider)
  // now, accessible to each sub component
  const dispatch = useDispatch()
  const anecdotes = useSelector(({filter, anecdotes}) => {  
    if (filter === 'ALL') return anecdotes
    else {
      const regExp = new RegExp(`${filter}`, 'iu')
      const filteredAnecdotes = anecdotes.filter(a => a.content.match(regExp))
      return filteredAnecdotes
    }
  })

  const vote = (anecdote) => {
    dispatch(voteAnecdote(anecdote))
    dispatch(setNotification(`You created ${anecdote.content}!`, 4))
  }
  
  return (
    <>
      <h2>Anecdotes</h2>
      {anecdotes.map(anecdote => {
        return (        
          <Anecdote 
            key={anecdote.id} 
            anecdote={anecdote}
            handleClick={() => vote(anecdote)}
          />
        )
      })}
    </>
  )
}

// presentational component
const Anecdote = ({anecdote, handleClick}) => {
  return (
    <>
      <div> {anecdote.content} </div>
        has {anecdote.votes}
      <button onClick={handleClick}>vote</button>
    </>
  )
}

export default AnecdoteList