import { useState } from 'react'

const Button = ({ onClick, text }) => (
  <button onClick={onClick}>
    {text}
  </button>
)

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
  
  // State to keep track of the selected anecdote and votes
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))
  
      // Handler for next anecdote
  const handleNextAnecdote = () => {
    setSelected(Math.floor(Math.random() * anecdotes.length)) //setSelected(number 0 -> 7)
  }

    // Handler for voting
  const handleVote = () => {
    const newVotes = [...votes]
    newVotes[selected] += 1
    setVotes(newVotes)
  }
  console.log(votes)
  return (
    <div>
      <h1>Anecdote of the day</h1>
      <div>
        {anecdotes[selected]}
      </div>
      <div>
        <p>has {votes[selected]} votes</p>
        <Button onClick={handleVote} text="vote" />
        <Button onClick={handleNextAnecdote} text="next anecdote" />
      <div>
        <h1>Anecdote with most votes</h1>
        <div>
          {anecdotes[votes.indexOf(Math.max(...votes))]}
        </div>
        <p>has {Math.max(...votes)} votes</p>
      </div>
      </div>
    </div>
  )
}

export default App