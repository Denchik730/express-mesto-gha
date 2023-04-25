const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле \'name\' должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля \'name\' - 2'],
    maxlength: [30, 'Максимальная длина поля \'name\' - 30'],
  },
  about: {
    type: String,
    required: [true, 'Поле \'about\' должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля \'about\' - 2'],
    maxlength: [30, 'Максимальная длина поля \'about\' - 30'],
  },
  avatar: {
    type: String,
    required: [true, 'Поле \'avatar\' должно быть заполнено'],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
}, {
  versionKey: false,
});

const User = mongoose.model('user', userSchema);

module.exports = { User };
