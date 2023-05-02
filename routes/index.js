const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const routerUsers = require('./users');
const routerCards = require('./cards');
const auth = require('../middlewares/auth');
const { NotFoundError } = require('../errors/NotFoundError');
const { login } = require('../controllers/users');
const { createUser } = require('../controllers/users');
const { reg } = require('../utils/constants');

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi
        .string()
        .pattern(reg),
    }),
  }),
  createUser,
);

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

router.get('/signout', auth, (req, res) => {
  res.clearCookie('token').send({ message: 'Выход' });
});

router.use('/users', auth, routerUsers);
router.use('/cards', auth, routerCards);

router.all('*', auth, (req, res, next) => {
  next(new NotFoundError('Неверный адрес запроса'));
});

module.exports = {
  router,
};
