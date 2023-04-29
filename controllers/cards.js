const CREATED_CARD_CODE = 201;

const { Card } = require('../models/card');
const { ValidationError } = require('../errors/ValidationError');
const { NotFoundError } = require('../errors/NotFoundError');
const { CastError } = require('../errors/CastError');

const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;

    const card = await Card.create({ name, link, owner });

    res.status(CREATED_CARD_CODE).send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new ValidationError(err.message));
    } else {
      next(err);
    }
  }
};

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});

    res.send(cards);
  } catch (err) {
    next(err);
  }
};

const deleteCard = async (req, res, next) => {
  const removeCard = () => {
    Card.findByIdAndRemove(req.params.cardId)
      .then((card) => res.send(card))
      .catch(next);
  }

  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return Promise.reject(new NotFoundError('Запрашиваемая карточка не найдена'));
      }

      if (card.owner.toString() !== req.user._id) {
        return Promise.reject(new NotFoundError('Невозможно удалить чужую карточку'));
      }

      return removeCard();
    })
    .catch(next);
  // try {
  //   const card = await Card.findByIdAndRemove(req.params.cardId);
  //   console.log(card);
  //   console.log(req.user);
  //   console.log(card.owner.toString());
  //   if (card.owner !== req.user._id) {
  //     throw new NotFoundError('Не твоя карточка');
  //   }

  //   if (!card) {
  //     throw new NotFoundError('Запрашиваемая карточка не найдена');
  //   }

  //   res.send(card);
  // } catch (err) {
  //   if (err.name === 'CastError') {
  //     next(new CastError('Переданы некорректные данные'));
  //   } else {
  //     next(err);
  //   }
  // }
};

const likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );

    if (!card) {
      throw new NotFoundError('Запрашиваемая карточка не найдена');
    }

    res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new CastError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );

    if (!card) {
      throw new NotFoundError('Запрашиваемая карточка не найдена');
    }

    res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new CastError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
