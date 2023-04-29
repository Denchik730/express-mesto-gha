const CREATED_USER_CODE = 201;

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { User } = require('../models/user');
const { ValidationError } = require('../errors/ValidationError');
const { NotFoundError } = require('../errors/NotFoundError');
const { CastError } = require('../errors/CastError');
const { ConflictError } = require('../errors/ConflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {

      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );

      res.cookie('token', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });

      res.send({ token });
    })
    .catch(next);
}

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => res.status(CREATED_USER_CODE).send(user))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Данный email уже зарегистрирован'));
      } else {
        next();
      }
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
      }

      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    })
}

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
      }

      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
  .then((user) => {
    if (!user) {
      next(new NotFoundError('Запрашиваемый пользователь не найден'));
    }

    return res.send(user);
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      next(new ValidationError(err.message));
    } else if (err.name === 'CastError') {
      next(new CastError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
  .then((user) => {
    if (!user) {
      next(new NotFoundError('Запрашиваемый пользователь не найден'));
    }

    return res.send(user);
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      next(new ValidationError(err.message));
    } else if (err.name === 'CastError') {
      next(new CastError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  });
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateAvatar,
  updateProfile,
  login,
  getCurrentUser,
};
