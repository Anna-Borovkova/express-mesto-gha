const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');

const router = require('./routes/index');
require('dotenv').config();

const PORT = 3000;

mongoose
  .connect('mongodb://127.0.0.1/mydb', {
    useNewUrlParser: true,
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: '64ce661882720ff6ae40b27d',
  };

  next();
});
app.use(router);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
