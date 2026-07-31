// import { useRef } from "react";

import Blog from "./Blog";
// import BlogForm from "./BlogForm";
// import Togglable from "./Togglable";

const Blogs = ({ blogs, user, updateBlog, deleteBlog }) => {

  return (
    <div>
      <h2>Blogs</h2>
      <ul>
        {[...blogs]
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <ul key={blog.id}>
              <Blog
                user={user}
                blog={blog}
                updateBlog={updateBlog}
                deleteBlog={deleteBlog}
              />
            </ul>
          ))}
      </ul>
    </div>
  );
};

export default Blogs;
