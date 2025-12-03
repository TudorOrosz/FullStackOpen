import { useState } from 'react'

const Blog = ({ user, blog, updateBlog, deleteBlog }) => {
  const [showDetails, setShowDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  const incrementLikes = async () => { 
    updateBlog ({
      id: blog.id,
      user: blog.user.id,
      likes: blog.likes + 1,
      title: blog.title,
      author: blog.author,
      url: blog.url
    })
  }  

  const toggleDelete = async () => {
    if(window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)){
      deleteBlog(blog.id)}
  }

  const canDelete = blog.user.id === user.id;

  console.log(blog.user.id); 
  console.log(user)

 return(
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button type="button" onClick={toggleDetails}>{showDetails ? 'hide' : 'view'}</button>
      {showDetails && (
        <div>
          <div>
            {blog.url}
          </div>
          <div>
            {blog.likes}
            <button type="button" onClick={incrementLikes}>like</button>
          </div>
          <div>
            {blog.user.name}
          </div>
            {canDelete && <button type="button" onClick={toggleDelete}>delete</button>}
        </div>
      )} 
    </div>  
  )
}

export default Blog