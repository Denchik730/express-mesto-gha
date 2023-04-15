const routerUsers = require('express').Router();
const { createUser, getUser, getUsers } = require('../controllers/users');

routerUsers.get('/', getUsers);

routerUsers.get('/:userId', getUser);

routerUsers.post('/', createUser);

module.exports = routerUsers;
