const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

// Helper function for obtaining token
// const getTokenFrom = request => {
//   const authorization = request.get('authorization')
//   if (authorization && authorization.startsWith('Bearer ')) {
//     return authorization.replace('Bearer ', '')
//   }
//   return null
// }

// Get blogs
blogsRouter.get('/', async (request, response) => { 
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

// Create new blog
blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body

  // get user from request object -> created by middleware
  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

// Delete blog
blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  
  // get user from request object -> created by middleware
  const user = request.user

  // find blog that we want to delete by id
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  // verify ownership of the blog: that the user associated with blog id provided in the request URL 
  // is the same as the user whose token was provided in the authorization
  if (blog.user.toString() === user._id.toString()) {
    await Blog.findByIdAndDelete(request.params.id)
    return response.status(204).end()
  } else {
    return response.status(403).json({ error: 'token does not match blog post owner ID' })
  }
})

// Update blog
blogsRouter.put('/:id', async (request, response, next) => {
  const { title, author, url, likes } = request.body
  const updated = { title, author, url, likes }

  try {
    const result = await Blog.findByIdAndUpdate(
      request.params.id,
      updated,
      { new: true, runValidators: true, context: 'query' }
    )

    if (result) {
      response.json(result)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter