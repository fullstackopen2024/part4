const mongoose = require('mongoose')

const USER_VALIDATION = {
  USERNAME_TOO_SHORT: "username has to be at least 3 characters long",
  PASSWORD_TOO_SHORT: {
    message: "password has to be at least 3 characters long",
    validate: function (user) {
      return user.password.length >= 3;
    }
  }
}

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: [3, USER_VALIDATION.USERNAME_TOO_SHORT]
  },
  passwordHash: String,
  name: String
})


userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = { User, USER_VALIDATION }