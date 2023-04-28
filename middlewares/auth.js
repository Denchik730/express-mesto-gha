const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  console.log(req.cookies)
  const { token } = req.cookies;

  if (!token) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
  } catch (err) {
    // отправим ошибку, если не получилось
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }
  console.log(payload)
  req.user = payload;
  console.log(req.user)

  next();
};