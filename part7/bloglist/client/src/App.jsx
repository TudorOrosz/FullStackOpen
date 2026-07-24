import { useState, useEffect, useRef } from "react";
import { ErrorBoundary } from "react-error-boundary";
import blogService from "./services/blogs";
import loginService from "./services/login";

import { useMessages, useBlogs, useLogin } from "./store";
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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const blogFormRef = useRef();
  const { blogs, setBlogs, addBlogInStore, updateBlogInStore, removeBlogFromStore} = useBlogs();
  const { text, type, setMessage, clearMessage } = useMessages();
  const { user, setUser, clearUser } = useLogin();

  useEffect(() => {
    blogService.getAll().then(setBlogs);
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
  const handleAddBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility();

    const createdBlog = await blogService.create(blogObject);
    createdBlog.user = {
      username: user.username,
      name: user.name,
      id: user.id,
    }; // so that user is also included in the createdBlog, so when we concatenate
    // in the next step the re-rendering will work. Otherwise the filter function down below will find the username
    addBlogInStore(createdBlog);
    showMessage(
      `a new blog '${blogObject.title}' by ${blogObject.author} added`,
      "success",
    );
  };

  // Function for updating a bog -> note that reference of it is used in the Blog component
  const handleUpdateBlog = async (blogObject) => {
    const blogId = blogObject.id;
    const { id, ...blogWithoutId } = blogObject;

    const updatedBlog = await blogService.update(blogId, blogWithoutId);

    // preserve original user as backend does not return username
    const original = blogs.find((b) => b.id === id);
    const normalized = { ...updatedBlog, user: original.user };
    updateBlogInStore(normalized);
  };

  const handleDeleteBlog = async (blogId) => {
    await blogService.deleteById(blogId);
    removeBlogFromStore(blogId);
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
    clearUser();
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
  
  // Early return to display login page
  if (user === null) {
    return (
      <div>

        {text && <Notification message={text} type={type} />}

        <LoginForm {...loginFormProps} />
      </div>
    );
  }

  console.log(blogs)

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
          <BlogForm createBlog={handleAddBlog} />
        </Togglable>

        <ul>
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog
                key={blog.id}
                user={user}
                blog={blog}
                updateBlog={handleUpdateBlog}
                deleteBlog={handleDeleteBlog}
              />
            ))}
        </ul>
      </ErrorBoundary>
    </div>
  );
};

export default App;
