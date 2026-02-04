import { useReducer, useContext } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import NotificationContext from './NotificationContext'
import { getAnecdotes, updateAnecdote } from './requests'



const App = () => {
  const queryClient = useQueryClient()

  const { setNotification } = useContext(NotificationContext)

  // Vote handler
  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    }
  })

  // Fetch anecdotes using React Query
  const result = useQuery({
    queryKey: ['anecdotes'],
    retry: false,
    queryFn: getAnecdotes,
    refetchOnWindowFocus: false
  })
 
  console.log(JSON.parse(JSON.stringify(result)))
 
  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  if (result.isLoading) {
    return <div>loading data...</div>
  }
 
  const anecdotes = result.data

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({...anecdote, votes: anecdote.votes + 1 })

    setNotification({ type: 'vote', content: anecdote.content })
    setTimeout(() => setNotification({ type: 'remove' }), 5000)
  }

  return (

      <div>
        <h3>Anecdote app</h3>

        <Notification />
        <AnecdoteForm />

        {anecdotes.map((anecdote) => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}
              <button onClick={() => handleVote(anecdote)}>vote</button>
            </div>
          </div>
        ))}
      </div>
  )
}

export default App