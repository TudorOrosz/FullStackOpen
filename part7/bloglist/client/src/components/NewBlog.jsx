import { useRef } from "react";

import BlogForm from "./BlogForm";
import Togglable from "./Togglable";

const NewBlog = ( {createBlog} ) => {
  const blogFormRef = useRef();

  const handleCreateBlog = async (blogObject) => {
    await createBlog(blogObject);
    blogFormRef.current.toggleVisibility();
  };

  return (
    <div>
        <BlogForm createBlog={handleCreateBlog} />
    </div>
  )
};

export default NewBlog;
