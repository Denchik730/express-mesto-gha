const routerUsers = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUser,
  getUsers,
  updateAvatar,
  updateProfile,
  getCurrentUser,
} = require('../controllers/users');
const { reg } = require('../utils/constants');

routerUsers.get('/', getUsers);

routerUsers.get('/me', getCurrentUser);

routerUsers.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().length(24).hex().required(),
    }),
  }),
  getUser,
);

routerUsers.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateProfile,
);

routerUsers.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi
        .string()
        .pattern(reg),
    }),
  }),
  updateAvatar,
);

module.exports = routerUsers;
