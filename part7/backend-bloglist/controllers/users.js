const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

const MIN_PASSWORD_LENGTH = 3

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {title: 1, author: 1, likes: 1})
  // the argument given to the populate method defines that the ids referencing
  // blog objects in the blogs field of the user document will be replaced
  // by the referenced blog document (pseudo join queries)

  // The functionality of the populate method of Mongoose is based on the 
  // fact that we have defined "types" to the references in the Mongoose 
  // schema with the ref option:

  response.json(users)
})

usersRouter.get('/:id', async (request, response) => {
  const id = request.params.id
  const user = await User.findById(id).populate('blogs', {title: 1, author: 1, likes: 1})
  response.json(user)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!password || password.length < MIN_PASSWORD_LENGTH ){     
    return response.status(400).json({error: 'invalid password'})
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