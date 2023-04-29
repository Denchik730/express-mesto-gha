const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const { AuthError } = require('../errors/AuthError');

module.exports = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    next(new AuthError('Необходима авторизация'));
  }

  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
  } catch (err) {
    // отправим ошибку, если не получилось
    next(new AuthError('Необходима авторизация'));
  }

  req.user = payload;

  next();
};
