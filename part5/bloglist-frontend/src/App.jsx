import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState({text: '', type: ''})
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])  

  const addBlog = async event => {
    event.preventDefault()
    const blogObject = {
      title: title,
      author: author,
      url: url
    }

    const createdBlog = await blogService.create(blogObject)
    createdBlog.user = { username: user.username }; // so that user is also included in the createdBlog, so when we concatenate
    // in the next step the re-rendering will work. Otherwise the filter function down below will find the username
    setBlogs(prevBlogs => prevBlogs.concat(createdBlog));
    setMessage({text: `a new blog '${title}' by ${author} added`, type: 'success'})
    setTimeout(() => { setMessage({text: '', type: ''}) }, 5000);
    setTitle('');
    setAuthor('');
    setUrl('');
  }

  const handleLogin = async event => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)

      setUser(user)
      setUsername('') 
      setPassword('')
    } catch (error) {
      console.error('Login failed:', error);
      setMessage({text: `wrong credentials`, type: 'error'})
      setTimeout(() => { setMessage({text: '', type: ''}) }, 5000);
    }    
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
  }
  // Component props
  const blogFormProps = { title, author, url, setTitle, setAuthor, setUrl, addBlog };
  const loginFormProps = { username, password, setUsername, setPassword, handleLogin };
  
  if (user === null) {
    return (
      <div>
        <h1>The insightful Blogs</h1>

        {message.text && <Notification message={message.text} type={message.type} />}

        <LoginForm {...loginFormProps} />
      </div>
    )
  } 

  return (
    <div>      
      <h1>The insightful Blogs</h1>
      
      {message.text && <Notification message={message.text} type={message.type} />}
      
      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <p style={{ margin: 0 }}>{user.name} is logged in</p>
          <button type="button" onClick={handleLogout}>logout</button>
        </div>
      )}

      <BlogForm {...blogFormProps} />

      <ul>
        {blogs
          .filter((blog) => blog.user && blog.user.username === user.username)
          .map(blog => (
          <Blog key={blog.id} blog={blog}/>
        ))}
      </ul>
    </div>
  )
}

export default App