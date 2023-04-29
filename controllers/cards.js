const CREATED_CARD_CODE = 201;

const { Card } = require('../models/card');
const { ValidationError } = require('../errors/ValidationError');
const { NotFoundError } = require('../errors/NotFoundError');
const { CastError } = require('../errors/CastError');
const { ForbiddenError } = require('../errors/ForbiddenError');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(CREATED_CARD_CODE).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(err.message));
      } else {
        next(err);
      }
    });
};

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const removeCard = () => {
    Card.findByIdAndRemove(req.params.cardId)
      .then((card) => res.send(card))
      .catch(next);
  };

  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Запрашиваемая карточка не найдена'));
      }

      if (card.owner.toString() !== req.user._id) {
        next(new ForbiddenError('Невозможно удалить чужую карточку'));
      }

      return removeCard();
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).then((card) => {
    if (!card) {
      next(new NotFoundError('Запрашиваемая карточка не найдена'));
    }

    return res.send(card);
  }).catch((err) => {
    if (err.name === 'CastError') {
      next(new CastError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).then((card) => {
    if (!card) {
      next(new NotFoundError('Запрашиваемая карточка не найдена'));
    }

    return res.send(card);
  }).catch((err) => {
    if (err.name === 'CastError') {
      next(new CastError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
