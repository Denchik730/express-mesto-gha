const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes/users');

const { PORT = 3000 } = process.env;

const app = express();

// mongoose
//   .connect('mongodb://127.0.0.1/mestodb');
  //  {
  //   useNewUrlParser: true,
  // })
  // .then(() => {
  //   console.log(`Подключено к базе данных`);
  // })
  // .catch((err) => {
  //   console.log('Ошибка подключения к базе данных');
  //   // console.error(err);
  // });
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', router);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
