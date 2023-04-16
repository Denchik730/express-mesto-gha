const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerUsers = require('./routes/users');
const routerCard = require('./routes/cards');
const errorHandler = require('./middlewares/errorHandler');
const { NotFoundError } = require('./errors/NotFoundError');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '643b92472855dee40b7a2021',
  };

  next();
});

app.use('/users', routerUsers);
app.use('/cards', routerCard);

app.all('*', (req, res, next) => {
  next(new NotFoundError('Неверный адрес запроса'));
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
