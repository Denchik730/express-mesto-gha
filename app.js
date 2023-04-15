const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerUsers = require('./routes/users');
const router = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '643a4c5b987b6c43ecd9539d'
  };

  next();
});

app.use('/users', routerUsers);
app.use('/cards', router);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
