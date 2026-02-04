import { createContext, useReducer } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'vote':
      return `You voted for '${action.content}'`
    case 'createAnecdote':
      return `You created a new anecdote '${action.content}'`
    case 'remove':
      return ""
    case 'error - anecdote length':
      return "too short anecdote, must have length 5 or more"
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, setNotification] = useReducer(notificationReducer, "")

  return (
    <NotificationContext.Provider value={{ notification, setNotification }}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext