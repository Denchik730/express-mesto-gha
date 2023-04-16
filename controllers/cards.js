const { Card } = require('../models/card');
const { ValidationError } = require('../errors/ValidationError');
const { NotFoundError } = require('../errors/NotFoundError');

const createCard = async (req, res, next) => {
  try {

    const { name, link } = req.body;
    const owner = req.user._id

    const card = await Card.create({ name, link, owner });

    res.send(card);

  } catch(err) {

    if (err.name === 'ValidationError') {

      next(new ValidationError('Переданы некорректные данные'));
      return;

    }

    next(err);
  }
};

const getCards = async (req, res, next) => {
  try {

    const cards = await Card.find({})

    res.send(cards);

  } catch(err) {

    next(err)

  }
};

const deleteCard = async (req, res, next) => {
  try {

    const card = await Card.findByIdAndRemove(req.params.cardId);

    if (!card) {
      throw new NotFoundError('Запрашиваемая карточка не найдена');
    }

    res.send(card);

  } catch(err) {

    next(err);

  }
};

const likeCard = async (req, res, next) => {
  try {

    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )

    if (!card) {
      throw new NotFoundError('Запрашиваемая карточка не найдена');
    }

    res.send(card);

  } catch(err) {

    if (err.name === 'ValidationError') {

      next(new ValidationError('Переданы некорректные данные'));
      return;

    }

    next(err);

  }
};

const dislikeCard = async (req, res, next) => {
  try {

    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )

    if (!card) {
      throw new NotFoundError('Запрашиваемая карточка не найдена');
    }

    res.send(card);

  } catch(err) {

    if (err.name === 'ValidationError') {

      next(new ValidationError('Переданы некорректные данные'));
      return;

    }

    next(err);

  }
};

module.exports = { createCard, getCards, deleteCard, likeCard, dislikeCard };