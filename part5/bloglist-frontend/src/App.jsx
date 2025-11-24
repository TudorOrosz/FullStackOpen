import { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'

import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState({text: '', type: ''})
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

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

  // Function for creating a blog -> note that reference of it is used in the BlogForm component
  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()

    const createdBlog = await blogService.create(blogObject)
    createdBlog.user = { username: user.username }; // so that user is also included in the createdBlog, so when we concatenate
    // in the next step the re-rendering will work. Otherwise the filter function down below will find the username
    setBlogs(prevBlogs => prevBlogs.concat(createdBlog));
    setMessage({text: `a new blog '${blogObject.title}' by ${blogObject.author} added`, type: 'success'})
    setTimeout(() => { setMessage({text: '', type: ''}) }, 5000);
  }

  // Function for updating a bog -> note that reference of it is used in the Blog component
  const updateBlog = async (blogObject) => {
    const blogId = blogObject.id
    const { id, ...blogWithoutId } = blogObject;

    const updatedBlog = await blogService.update(blogId, blogWithoutId)

    // preserve original user as backend does not return username
    const original = blogs.find(b => b.id === id)
    const normalized = { ...updatedBlog, user: original.user }
    console.log(original.user)
    
    setBlogs(prevBlogs =>
      prevBlogs.map(b => (b.id !== id ? b : normalized))
    )
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
  const loginFormProps = { username, password, setUsername, setPassword, handleLogin };
  //const blogFormProps = { title, author, url, setTitle, setAuthor, setUrl, addBlog };
  
  // Early return to display login page
  if (user === null) {
    return (
      <div>
        <h1>The insightful Blogs</h1>

        {message.text && <Notification message={message.text} type={message.type} />}

        <LoginForm {...loginFormProps} />
      </div>
    )
  } 

  // Display rest of the app when user is logged in
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

      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      <ul>
        {blogs
          .filter((blog) => blog.user && blog.user.username === user.username)
          .map(blog => (
          <Blog key={blog.id} blog={blog} updateBlog={updateBlog}/>
        ))}
      </ul>
    </div>
  )
}

export default App