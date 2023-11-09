import { useDispatch } from 'react-redux'
import { addAnecdote } from '../reducers/anecdoteReducer'
import { displayNotification, removeNotification } from '../reducers/notificationReducer'

import anecdoteService from '../services/anecdotes'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const newAnecdote = async event => {
    event.preventDefault()
    const content = event.target.anecdote.value
    const createdAnecdote = await anecdoteService.createNew(content)
    dispatch(addAnecdote(createdAnecdote))
    dispatch(displayNotification(`You created ${content}!`))
    setTimeout(() => dispatch(removeNotification()), 4000)
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={e => newAnecdote(e)}>
        <div>
          <input type='text' name='anecdote'/>
        </div>
        <button type='submit'>create</button>
      </form>
    </>
  )
}

export default AnecdoteForm