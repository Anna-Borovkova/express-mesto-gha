const httpConstants = require('http2').constants;
const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const DeleteForbiddenError = require('../errors/delete-forbidden-error');

const getCards = (req, res, next) => {
  Card.find()
    .then((cards) => {
      res.status(httpConstants.HTTP_STATUS_OK).send(cards);
    })
    .catch((err) => next(err));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(httpConstants.HTTP_STATUS_CREATED).send({ card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Input data incorrect'));
      }
      return next(err);
    });
};

const deleteCardById = (req, res, next) => {
  const { cardId } = req.params;
  return Card.findById(cardId)
    .orFail(new Error('NotValidId'))
    .then((checkedCard) => {
      if (checkedCard.owner.toString() !== req.user._id) {
        return next(new DeleteForbiddenError('Delete forbidden'));
      }
      return Card.findByIdAndRemove(cardId)
        .then((removedCard) => {
          res.status(httpConstants.HTTP_STATUS_OK).send(removedCard);
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            return next(new BadRequestError('Cast error'));
          }
          return next(err);
        });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        return next(new NotFoundError('Card not found'));
      }
      if (err.name === 'CastError') {
        return next(new BadRequestError('Cast error'));
      }
      return next(err);
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail(new Error('NotValidId'))
    .then((card) => {
      res.status(httpConstants.HTTP_STATUS_OK).send(card);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        return next(new NotFoundError('Card not found'));
      }
      if (err.name === 'CastError') {
        return next(new BadRequestError('Cast error'));
      }
      return next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail(new Error('NotValidId'))
    .then((card) => {
      res.status(httpConstants.HTTP_STATUS_OK).send(card);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        return next(new NotFoundError('Card not found'));
      }
      if (err.name === 'CastError') {
        return next(new BadRequestError('Cast error'));
      }
      return next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
