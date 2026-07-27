import { useField } from '../hooks/index.js'

const LoginForm = ({ handleLogin }) => {
  const username = useField('')
  const password = useField('')

  const handleSubmit = (event) => {
    handleLogin(event, username.value, password.value)
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login to application</h2>
      <div>
        <label>
          username
          <input
            type={username.type}
            value={username.value}
            onChange={username.onChange}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type={password.type}
            value={password.value}
            onChange={password.onChange}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
    )};

export default LoginForm;
