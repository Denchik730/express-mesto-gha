const { Card } = require('../models/card');

const createCard = (req, res) => {
  console.log(req.user._id); // _id станет доступен

  const { name, link } = req.body;
  const owner = req.user._id
  console.log(name, link); // _id станет доступен

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
  .then(card => res.send({ data: card }))
  .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
  .then(card => res.send({ data: card }))
  .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports = { createCard, getCards, deleteCard, likeCard, dislikeCard };