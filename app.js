require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { routerUsers, routerCards } = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const { NotFoundError } = require('./errors/NotFoundError');
const { login } = require('./controllers/users');
const { createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  autoIndex: true,
});

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signup', createUser);

app.post('/signin', login);

// app.use(auth);

app.use('/users', auth, routerUsers);
app.use('/cards', auth, routerCards);

app.all('*', (req, res, next) => {
  next(new NotFoundError('Неверный адрес запроса'));
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
