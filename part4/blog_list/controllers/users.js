const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

// Get users
usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('blogs', {title: 1, author: 1, likes: 1})
  response.json(users)
})

// Create user
usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!password || password.length < 3) {
    return response.status(400).json({
      error: 'Password must be given with user creation and be at least 3 characters long'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter