const routerUsers = require('express').Router();
const {
  getUser,
  getUsers,
  updateAvatar,
  updateProfile,
  getCurrentUser,
} = require('../controllers/users');

routerUsers.get('/', getUsers);

routerUsers.get('/me', getCurrentUser);

routerUsers.get('/:userId', getUser);

routerUsers.patch('/me', updateProfile);

routerUsers.patch('/me/avatar', updateAvatar);

module.exports = routerUsers;
