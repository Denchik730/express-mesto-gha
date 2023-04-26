const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { jwt } = req.cookie;

  if (!jwt) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(jwt, 'some-secret-key');
  } catch (err) {
    // отправим ошибку, если не получилось
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  next();
};