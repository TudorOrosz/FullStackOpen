import { useState, useEffect, useRef } from "react";
import { ErrorBoundary } from "react-error-boundary";
import blogService from "./services/blogs";
import loginService from "./services/login";

import { useMessages } from './store'
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";

function ErrorFallback({ error }) {
  return (
    <div>
      <h2>Oops, something went wrong!</h2>
      <p>{error.message || "Something went wrong"}</p>
    </div>
  );
}

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const blogFormRef = useRef();
  const { text, type, setMessage, clearMessage } = useMessages();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  // Set a temporary notification message and clear it after 5 seconds
  const showMessage = (messageText, messageType) => {
    setMessage({ text: messageText, type: messageType });
    setTimeout(() => clearMessage(), 5000);
  };

  // Function for creating a blog -> note that reference of it is used in the BlogForm component
  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility();

    const createdBlog = await blogService.create(blogObject);
    createdBlog.user = {
      username: user.username,
      name: user.name,
      id: user.id,
    }; // so that user is also included in the createdBlog, so when we concatenate
    // in the next step the re-rendering will work. Otherwise the filter function down below will find the username
    setBlogs((prevBlogs) => prevBlogs.concat(createdBlog));
    showMessage(
      `a new blog '${blogObject.title}' by ${blogObject.author} added`,
      "success",
    );
  };

  // Function for updating a bog -> note that reference of it is used in the Blog component
  const updateBlog = async (blogObject) => {
    const blogId = blogObject.id;
    const { id, ...blogWithoutId } = blogObject;

    const updatedBlog = await blogService.update(blogId, blogWithoutId);

    // preserve original user as backend does not return username
    const original = blogs.find((b) => b.id === id);
    const normalized = { ...updatedBlog, user: original.user };
    console.log(original.user);

    setBlogs((prevBlogs) =>
      prevBlogs.map((b) => (b.id !== id ? b : normalized)),
    );
  };

  const deleteBlog = async (blogId) => {
    await blogService.deleteById(blogId);
    setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== blogId));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log("logging in with", username, password);

    try {
      const user = await loginService.login({ username, password });
      console.log(user);
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);

      setUser(user);
      console.log(user);
      setUsername("");
      setPassword("");
    } catch (error) {
      console.error("Login failed:", error);
      showMessage("wrong credentials", "error");
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
    blogService.setToken(null);
  };
  // Component props
  const loginFormProps = {
    username,
    password,
    setUsername,
    setPassword,
    handleLogin,
  };
  //const blogFormProps = { title, author, url, setTitle, setAuthor, setUrl, addBlog };

  // Early return to display login page
  if (user === null) {
    return (
      <div>
        <h1>The insightful Blogs</h1>

        {text && <Notification message={text} type={type} />}

        <LoginForm {...loginFormProps} />
      </div>
    );
  }

  // Display rest of the app when user is logged in
  return (
    <div>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        {text && <Notification message={text} type={type} />}

        {user && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <p style={{ margin: 0 }}>{user.name} is logged in</p>
            <button type="button" onClick={handleLogout}>
              logout
            </button>
          </div>
        )}

        <Togglable buttonLabel="create new blog" ref={blogFormRef}>
          <BlogForm createBlog={addBlog} />
        </Togglable>

        <ul>
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog
                key={blog.id}
                user={user}
                blog={blog}
                updateBlog={updateBlog}
                deleteBlog={deleteBlog}
              />
            ))}
        </ul>
      </ErrorBoundary>
    </div>
  );
};

export default App;
