const jwt = require('jsonwebtoken');

const { User } = require("../models/user");

const login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {

      const token = jwt.sign(
        { _id: user._id },
          'some-secret-key',
          { expiresIn: '7d' },
         );

      req.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      })

      res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    })
}

module.exports = { login };
