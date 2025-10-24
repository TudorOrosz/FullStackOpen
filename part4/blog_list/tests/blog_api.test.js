const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('unique identifier property of blog posts is named id', async () => {
  const response = await api.get('/api/blogs')
  const blogs = response.body

  // each blog should have `id` and should not expose `_id`
  blogs.forEach(blog => {
    assert.ok(blog.id, 'blog is missing id property')
    assert.strictEqual(blog._id, undefined, 'blog should not have _id property')
  })
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: "test Title",
    author: "test Author",
    url: "www.test.com",
    likes: 7,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const titles = response.body.map(r => r.title)

  assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
  assert(titles.includes('test Title'))
})

test('if like property is missing from the request, it will default to 0', async () => {
  const newBlog = {
    title: "test Title 2",
    author: "test Author 2",
    url: "www.test.com 2"
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const testBlog = response.body.filter(r => r.title === "test Title 2")
  
  assert.strictEqual(testBlog[0].likes, 0)
})

test('if the title or url properties are missing from the request, the backend responds with status code 400', async () => {
  const missingUrl = { title: 'test Title 3', author: 'test Author 3', likes: 7 }
  const missingTitle = { author: 'test Author 4', url: 'www.test.com 4', likes: 7 }

  for (const blog of [missingUrl, missingTitle]) {
    await api.post('/api/blogs').send(blog).expect(400)
  }
})

after(async () => {
  await mongoose.connection.close()
})