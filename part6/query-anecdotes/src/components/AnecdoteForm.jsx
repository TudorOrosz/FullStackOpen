import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../requests'

import { useContext } from 'react'
import NotificationContext from '../NotificationContext'


const AnecdoteForm = () => {
  const queryClient = useQueryClient()

  const { setNotification } = useContext(NotificationContext) //this I don't get, what is the value of NotificationContext?

  const newNoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
    onError: () => {
      setNotification({ type: 'error - anecdote length' })
      setTimeout(() => setNotification({ type: 'remove' }), 5000)
    }   
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    const getId = () => (100000 * Math.random()).toFixed(0)
    newNoteMutation.mutate({ content, votes: 0, id: getId() })

    setNotification({ type: 'createAnecdote', content })
    setTimeout(() => setNotification({ type: 'remove' }), 5000)

  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
