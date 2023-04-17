const CREATED_USER_CODE = 201;

const { User } = require('../models/user');
const { ValidationError } = require('../errors/ValidationError');
const { NotFoundError } = require('../errors/NotFoundError');
const { CastError } = require('../errors/CastError');

const createUser = async (req, res, next) => {
  try {
    const { name, about, avatar } = req.body;

    const user = await User.create({ name, about, avatar });

    res.status(CREATED_USER_CODE).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new ValidationError(err.message));
    } else {
      next(err);
    }
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});

    res.send(users);
  } catch (err) {
    next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      next(new NotFoundError('Запрашиваемый пользователь не найден'));
    }

    res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new CastError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, about } = req.body;

    const user = await User.findByIdAndUpdate(req.user._id, { name, about }, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new NotFoundError('Запрашиваемый пользователь не найден');
    }

    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new ValidationError(err.message));
    } else if (err.name === 'CastError') {
      next(new CastError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;

    const user = await User.findByIdAndUpdate(req.user._id, { avatar }, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new NotFoundError('Запрашиваемый пользователь не найден');
    }

    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new ValidationError(err.message));
    } else {
      next(err);
    }
  }
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateAvatar,
  updateProfile,
};
