import { useState } from 'react'

const Blog = ({ blog }) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
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
            <button type="button">like</button>
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