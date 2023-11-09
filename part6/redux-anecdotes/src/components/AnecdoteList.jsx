/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'
import { displayNotification, removeNotification } from '../reducers/notificationReducer'

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

  const voteAnecdote = (anecdote) => {
    dispatch(vote(anecdote.id))
    dispatch(displayNotification(`You voted for ${anecdote.content}!`))
    setTimeout(() => dispatch(removeNotification()), 4000)
  }
  
  return (
    <>
      <h2>Anecdotes</h2>
      {anecdotes.map(anecdote => {
        return (        
          <Anecdote 
            key={anecdote.id} 
            anecdote={anecdote}
            handleClick={() => voteAnecdote(anecdote)}
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