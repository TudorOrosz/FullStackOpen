import { useState } from 'react'

const Blog = ({ blog, updateBlog }) => {
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

 return(
    <div style={blogStyle}>
      {blog.title} {blog.author}
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
        </div>
      )}
      <button type="button" onClick={toggleDetails}>view</button>
    </div>  
  )
}

export default Blog