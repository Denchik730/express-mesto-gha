const routerUsers = require('express').Router();
const {
  // createUser,
  getUser,
  getUsers,
  updateAvatar,
  updateProfile,
} = require('../controllers/users');

routerUsers.get('/', getUsers);

routerUsers.get('/:userId', getUser);

// routerUsers.post('/', createUser);

routerUsers.patch('/me', updateProfile);

routerUsers.patch('/me/avatar', updateAvatar);

module.exports = routerUsers;
