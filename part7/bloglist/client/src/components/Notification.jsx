const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={type === 'error' ? 'error_message' : 'success_message'}>
      {message}
    </div>
  )
}

export default Notification