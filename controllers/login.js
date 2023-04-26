const jwt = require('jsonwebtoken');

const { User } = require("../models/user");

const { NODE_ENV, JWT_SECRET } = process.env;

const login = (req, res) => {
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
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
}

module.exports = { login };
