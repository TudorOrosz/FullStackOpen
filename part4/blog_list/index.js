const express = require('express')
const mongoose = require('mongoose')

const app = express()

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

const Blog = mongoose.model('Blog', blogSchema)

const mongoUrl = 'mongodb+srv://tudororosz:dch9Y6Yb9aTTAWIT@cluster0.mtmf7mx.mongodb.net/blog_listApp?retryWrites=true&w=majority&appName=Cluster0'
mongoose.connect(mongoUrl)
  .then(() => {
    console.log('connected to MongoDB, db:', mongoose.connection.db.databaseName)
  })
  .catch(err => {
    console.error('error connecting to MongoDB:', err.message)
  })

app.use(express.json())

app.get('/api/blogs', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog.save().then((result) => {
    response.status(201).json(result)
  })
})

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})