const router = require('express').Router();
const { createCard, getCards, deleteCard, likeCard, dislikeCard } = require('../controllers/cards');

router.post('/', createCard);

router.get('/', getCards);

router.delete('/:cardId', deleteCard);

router.patch('/:cardId/likes', likeCard);

router.patch('/:cardId/likes', dislikeCard);

module.exports = router;