import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from "../requests"
import { useContext } from "react"
import NotificationContext from "../NotificationContext"

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const [notification, dispatch] = useContext(NotificationContext)

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote, 
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
      dispatch({payload: `You created ${newAnecdote.content}`})
      setTimeout(() => dispatch({type: 'CANCEL'}), 5000)
    },
    onError: () => {
      dispatch({payload: 'too short anecdote, must have length 5 or more'})
      setTimeout(() => dispatch({type: 'CANCEL'}), 5000)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0 })
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
