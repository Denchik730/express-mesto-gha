const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const { AuthError } = require('../errors/AuthError');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate: {
      validator: validator.isEmail,
    },
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  name: {
    type: String,
    minlength: [2, 'Минимальная длина поля \'name\' - 2'],
    maxlength: [30, 'Максимальная длина поля \'name\' - 30'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, 'Минимальная длина поля \'about\' - 2'],
    maxlength: [30, 'Максимальная длина поля \'about\' - 30'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator: function(v) {
        return /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/.test(v);
      },
      message: props => `${props.value} не валидная ссылка`
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
}, {
  versionKey: false,
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthError('Передан неверный логин или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthError('Передан неверный логин или пароль'));
          }

          return user;
        });
    });
};

const User = mongoose.model('user', userSchema);

module.exports = { User };
