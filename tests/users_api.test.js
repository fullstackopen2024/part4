const { test, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const { User, USER_VALIDATION } = require('../models/user')
const helper = require("./test_helper");

const api = supertest(app)

describe('when there is initially some users saved', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    let userObject = new User(helper.initialUsers[0])
    await userObject.save()
    userObject = new User(helper.initialUsers[1])
    await userObject.save()
  })

  test('username has to be at least 3 chars long', async () => {
    const newUser = {
      username: "aa",
      password: "some password",
      name: "some name"
    }

    const errorResponse = await api.post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(errorResponse.body.error.includes(USER_VALIDATION.USERNAME_TOO_SHORT), true)
  })

  test('password has to be at least 3 chars long', async () => {
    const newUser = {
      username: "vlad101vlad",
      password: "a",
      name: "some name"
    }

    const errorResponse = await api.post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(errorResponse.body.error.includes(USER_VALIDATION.PASSWORD_TOO_SHORT.message), true)
  })
})
