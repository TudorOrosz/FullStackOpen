const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// Get blogs
blogsRouter.get('/', async (request, response) => { 
  const blogs = await Blog.find({})
  response.json(blogs)
})

// Create new blog
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

// Delete blog
blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

// Update blog
blogsRouter.put('/:id', async (request, response) => {
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