const routerUsers = require('express').Router();
const { createUser, getUser, getUsers } = require('../controllers/users');

routerUsers.get('/users', getUsers);

routerUsers.get('/users/:userId', getUser);

routerUsers.post('/users', createUser);

module.exports = routerUsers;
