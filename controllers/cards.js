const httpConstants = require('http2').constants;

const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find()
    .then((cards) => {
      res.status(httpConstants.HTTP_STATUS_OK).send(cards);
    })
    .catch(() => res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
      message: 'Server Error',
    }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(httpConstants.HTTP_STATUS_CREATED).send({ card });
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

const deleteCardById = (req, res) => {
  const { cardId } = req.params;
  return Card.findByIdAndRemove(cardId)
    .orFail(new Error('NotValidId'))
    .then((card) => {
      res.status(httpConstants.HTTP_STATUS_OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'NotValidId') {
        return res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'Card not found' });
      }
      if (err.name === 'CastError') {
        return res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Cast error' });
      }
      return res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
        message: 'Server Error',
      });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true, runValidators: true },
  )
    .orFail(new Error('NotValidId'))
    .then((card) => {
      res.status(httpConstants.HTTP_STATUS_OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'NotValidId') {
        return res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'Card not found' });
      }
      if (err.name === 'CastError') {
        return res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Cast error' });
      }
      return res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
        message: 'Server Error',
      });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true, runValidators: true },
  )
    .orFail(new Error('NotValidId'))
    .then((card) => {
      res.status(httpConstants.HTTP_STATUS_OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'NotValidId') {
        return res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'Card not found' });
      }
      if (err.name === 'CastError') {
        return res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Cast error' });
      }
      return res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
        message: 'Server Error',
      });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
