import { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Navigate, Route, Routes } from "react-router-dom";
import { useMessages, useBlogs, useLogin, useUsers } from "./store";

import blogService from "./services/blogs";
import userService from "./services/users";
import loginService from "./services/login";
import persistentUser from "./services/persistentUser";

import Blogs from "./components/Blogs";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import Header from "./components/Header";
import NotFound from "./components/NotFound";
import Users from "./components/Users";
import NewBlog from "./components/NewBlog";

function ErrorFallback({ error }) {
  return (
    <div>
      <h2>Oops, something went wrong!</h2>
      <p>{error.message || "Something went wrong"}</p>
    </div>
  );
}

const App = () => {
  const {
    blogs,
    setBlogs,
    addBlogInStore,
    updateBlogInStore,
    removeBlogFromStore,
  } = useBlogs();
  const { users, setUsers } = useUsers();
  const { text, type, setMessage, clearMessage } = useMessages();
  const { user, setUser, clearUser } = useLogin();

  useEffect(() => {
    blogService.getAll().then(setBlogs);
  }, [setBlogs]);

  useEffect(() => {
    userService.getAll().then(setUsers);
  }, [setUsers]);

  useEffect(() => {
    const loggedUserJSON = persistentUser.getUser();
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, [setUser]);

  // Set a temporary notification message and clear it after 5 seconds
  const showMessage = (messageText, messageType) => {
    setMessage({ text: messageText, type: messageType });
    setTimeout(() => clearMessage(), 5000);
  };

  // Function for creating a blog -> note that reference of it is used in the BlogForm component
  const handleAddBlog = async (blogObject) => {
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

  const handleLogin = async (event, username, password) => {
    event.preventDefault();
    console.log("logging in with", username, password);

    try {
      const user = await loginService.login({ username, password });
      persistentUser.saveUser(user);
      blogService.setToken(user.token);

      setUser(user);
    } catch (error) {
      console.error("Login failed:", error);
      showMessage("wrong credentials", "error");
    }
  };

  const handleLogout = () => {
    persistentUser.removeUser();
    clearUser();
    blogService.setToken(null);
  };

  return (
    <div>
      <Header user={user} handleLogout={handleLogout} />
      {text && <Notification message={text} type={type} />}

      {user === null ? (
        <LoginForm handleLogin={handleLogin} />
      ) : (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Routes>
            <Route path="/" element={<Navigate to="/blogs" replace />} />
            <Route
              path="/blogs"
              element={
                <Blogs
                  blogs={blogs}
                  user={user}
                  // createBlog={handleAddBlog}
                  updateBlog={handleUpdateBlog}
                  deleteBlog={handleDeleteBlog}
                />
              }
            />
            <Route path="/users" element={<Users users={users} />} />
            <Route
              path="/new_blog"
              element={<NewBlog createBlog={handleAddBlog} />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      )}
    </div>
  );
};

export default App;
