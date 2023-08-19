const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const router = require('./routes/index');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/error-handler');

require('dotenv').config();
const cookieParser = require('cookie-parser');

const app = express();
const { PORT = 3000, MONGODB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const {
  createUser,
  login,
} = require('./controllers/users');

mongoose
  .connect(MONGODB_URL, {
    useNewUrlParser: true,
    autoIndex: true,
  });

app.use(helmet());

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use(router);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
