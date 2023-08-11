const httpConstants = require('http2').constants;

const User = require('../models/user');

const getUsers = (req, res) => {
  User.find()
    .then((users) => {
      res.status(httpConstants.HTTP_STATUS_OK).send(users);
    })
    .catch(() => res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server Error' }));
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.status(httpConstants.HTTP_STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        return res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'User not found' });
      }
      if (err.name === 'CastError') {
        return res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Cast error' });
      }
      return res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
        message: 'Server Error',
      });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(httpConstants.HTTP_STATUS_CREATED).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(', ')}`,
        });
      }
      return res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
        message: 'Server Error',
      });
    });
};

const updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.status(httpConstants.HTTP_STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        return res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'User not found' });
      }
      if (err.name === 'ValidationError') {
        return res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(', ')}`,
        });
      }
      return res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
        message: 'Server Error',
      });
    });
};

const updateUserAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.status(httpConstants.HTTP_STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        return res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'User not found' });
      }
      if (err.name === 'ValidationError') {
        return res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(', ')}`,
        });
      }
      return res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
        message: 'Server Error',
      });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};
