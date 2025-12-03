const LoginForm = ({ username, password, setUsername, setPassword, handleLogin }) => (
  <form onSubmit={handleLogin}>
    <h2>Login to application</h2>
    <div>
      <label>
                username
        <input
          type="text"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </label>
    </div>
    <div>
      <label>
                password
        <input
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </label>
    </div>
    <button type="submit">login</button>
  </form>
)

export default LoginForm