const { User } = require('../models/user');
const { ValidationError } = require('../errors/ValidationError');
const { NotFoundError } = require('../errors/NotFoundError');

const createUser = async (req, res, next) => {
  try {

    const { name, about, avatar } = req.body;

    const user = await User.create({ name, about, avatar });

    res.send(user);

  } catch(err) {

    if (err.name === 'ValidationError') {

      next(new ValidationError('Переданы некорректные данные'));
      return;

    }

    next(err);
  }
};


const getUsers = async (req, res, next) => {
  try {

    const users = await User.find({});

    res.send(users);

  } catch(err) {

    next(err)

  }
};


const getUser = async (req, res, next) => {
  try {

    const user = await User.findById(req.params.userId);

    res.send(user);

  } catch(err) {

    if (err.name === 'CastError') {

      next(new NotFoundError('Пользователь с данным _id не найден'));
      return;

    }

    next(err)
  }
};

const updateProfile = async (req, res, next) => {
  try {

    const { name, about } = req.body;

    const user = await User.findByIdAndUpdate('req.user._id', { name, about });

    if (!user) {
      throw new NotFoundError('Пользователь с данным _id не найден');
    }

    res.send(user);

  } catch(err) {

    next(err);
  }
};

const updateAvatar = async (req, res, next) => {
  try {

    const { avatar } = req.body;

    const user = await User.findByIdAndUpdate('req.user._id', { avatar });

    if (!user) {
      throw new NotFoundError('Пользователь с данным _id не найден');
    }

    res.send(user);

  } catch(err) {

    next(err);

  }
};


module.exports = { createUser, getUsers, getUser, updateAvatar, updateProfile };