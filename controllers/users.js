const usersRouter = require('express').Router()
const { User, USER_VALIDATION } = require('../models/user')
const bcrypt = require("bcrypt");

const validateUser = (user, response) => {
  if (!USER_VALIDATION.PASSWORD_TOO_SHORT.validate(user)) {
    response.status(400).json({ error: USER_VALIDATION.PASSWORD_TOO_SHORT.message })
  }
  return true;
}

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body
  validateUser({ username, name, password }, response)

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

usersRouter.get('/', async (request, response) => {
  const usersResponse = await User.find({})
  response.json(usersResponse);
})

module.exports = usersRouter