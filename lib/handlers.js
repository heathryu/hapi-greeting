const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');
const uuid = require('uuid');
const fs = require('fs');

const CardStore = require('./cardStore');

const Handlers = {};

const mapImages = () => {
  return fs.readdirSync('./public/images/cards');
};

Handlers.cardsHandler = (req, h) => {
  return h.view('cards', { cards: CardStore.cards });
};

var cardSchema = Joi.object().keys({
  name: Joi.string()
    .min(3)
    .max(50)
    .required(),
  recipient_email: Joi.string()
    .email()
    .required(),
  sender_name: Joi.string()
    .min(3)
    .max(50)
    .required(),
  sender_email: Joi.string()
    .email()
    .required(),
  card_image: Joi.string()
    .regex(/.+\.(jpg|bmp|png|gif)\b/)
    .required()
});

Handlers.newCardHandler = (req, h) => {
  if (req.method === 'get') {
    return h.view('new', { cardImages: mapImages() });
  } else if (req.method === 'post') {
    return Joi.validate(req.payload, cardSchema, (err, val) => {
      if (err) {
        throw Boom.badRequest(err.details[0].message);
      }

      const card = {
        name: val.name,
        recipient_email: val.recipient_email,
        sender_name: val.sender_name,
        sender_email: val.sender_email,
        card_image: val.card_image
      };

      saveCard(card);

      return h.redirect('/cards');
    });
  }
};

Handlers.deleteCardHandler = (req, h) => {
  delete CardStore.cards[req.params.id];
  return h.response();
};

const saveCard = card => {
  const id = uuid.v1();
  card.id = id;
  CardStore.cards[id] = card;
};

module.exports = Handlers;
