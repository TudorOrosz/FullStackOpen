const bcrypt = require('bcrypt')
const User = require('../models/user')
const assert = require('node:assert')
const { test, describe, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const { xor } = require('lodash')

const api = supertest(app)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()
    
    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  describe('restrcitions apply to username and password, no user is created if:', () => {
    test('username is empty', async () => {
        const usersAtStart = await helper.usersInDb()
        const newUser = { name: 'test user', password: 'test pass',}
        await api.post('/api/users').send(newUser).expect(400).expect('Content-Type', /application\/json/)
    })

    test('username is not unique', async () => {
        const usersAtStart = await helper.usersInDb()
        const newUser = { username: 'root', name: 'duplicate', password: 'test pass',}
        await api.post('/api/users').send(newUser).expect(400).expect('Content-Type', /application\/json/)
    })

    test('[username] is under 3 character', async () => {
        const usersAtStart = await helper.usersInDb()
        const newUser = { username: 'hi', name: 'short user', password: 'test pass',}
        await api.post('/api/users').send(newUser).expect(400).expect('Content-Type', /application\/json/)
    })

    test('password is empty', async () => {
        const usersAtStart = await helper.usersInDb()
        const newUser = { username: 'test user', name: 'password empty',}
        await api.post('/api/users').send(newUser).expect(400).expect('Content-Type', /application\/json/)
    })
    test('password is under 3 character', async () => {
        const usersAtStart = await helper.usersInDb()
        const newUser = { username: 'test user', name: 'short password', password: 'hi',}
        await api.post('/api/users').send(newUser).expect(400).expect('Content-Type', /application\/json/)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
