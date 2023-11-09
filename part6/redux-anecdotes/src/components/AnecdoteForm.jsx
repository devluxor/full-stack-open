import { useDispatch } from 'react-redux'
import { addAnecdote } from '../reducers/anecdoteReducer'
import { displayNotification, removeNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const newNote = event => {
    event.preventDefault()
    const content = event.target.anecdote.value
    dispatch(addAnecdote(content))
    dispatch(displayNotification(`You created ${content}!`))
    setTimeout(() => dispatch(removeNotification()), 4000)
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={e => newNote(e)}>
        <div>
          <input type='text' name='anecdote'/>
        </div>
        <button type='submit'>create</button>
      </form>
    </>
  )
}

export default AnecdoteForm