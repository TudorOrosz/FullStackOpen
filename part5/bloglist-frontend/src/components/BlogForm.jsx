import { useState } from 'react'

const BlogForm = ({ addBlog, title, author, url, setTitle, setAuthor, setUrl  }) => {
  const [newBlog, setNewBlog] = useState('')

  // const addBlog = async event => {
  //   event.preventDefault()
  //   createNote({
  //     content: newNote,
  //     important: true
  //   })

  //   setNewNote('')
  // }



  
  return (
    <div>
      <h2>Create new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          <label>
            title
            <input
              type="text"
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            author
            <input
              type="text"
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            url
            <input
              type="text"
              value={url}
              onChange={({ target }) => setUrl(target.value)}
            />
          </label>
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm