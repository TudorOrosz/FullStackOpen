import { useState } from 'react'

// Component to display a line of statistics
const StatisticLine = ({text, value}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

// Component to display statistics based on feedback
const Statistics = ({ good, neutral, bad }) => {
  console.log(good, neutral, bad)
  if (good + neutral + bad === 0) {
    return (
      <div>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </div>
    )
  }
  return (
    <div>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticLine text="good" value ={good} />
          <StatisticLine text="neutral" value ={neutral} />
          <StatisticLine text="bad" value ={bad} />
          <StatisticLine text="all" value ={good + neutral + bad} />
          <StatisticLine text="average" value ={(good - bad) / (good + neutral + bad)} />
          <StatisticLine text="positive" value ={(good / (good + neutral + bad) * 100) + ' %'} />
          </tbody>
      </table>
    </div>
  )}

// Component for a button that can be reused
const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={() => setGood(good + 1)} text = 'good' />
      <Button onClick={() => setNeutral(neutral + 1)} text = 'neutral' />
      <Button onClick={() => setBad(bad + 1)} text = 'bad' />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App