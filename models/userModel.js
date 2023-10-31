const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'name is required'],
    minlength: [5, 'name should have at least 5 character'],
    maxlength: [50, 'name should have at most 50 character'],
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    lowercase: true,
    unique: true,
    validate: [isEmail, `your email isn't right`],
  },
  photo: String,
  password: {
    type: String,
    trim: true,
    min: [8, 'your password should at least 8 characters'],
    max: [64, 'your password should at least 64 characters'],
  },
  passwordConfirm: {
    type: String,
    trim: true,
    min: [8, 'your password should at least 8 characters'],
    max: [64, 'your password should at least 64 characters'],
    validate: {
      validator: function (el) {
        return this.password === el;
      },
      message: 'password confirm is not the same as password',
    },
  },
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();

  bcrypt.hash(this.password, 12, (err, hash) => {
    this.password = hash;
  });

  this.passwordConfirm = undefined;

  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
