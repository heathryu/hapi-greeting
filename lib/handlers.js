const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');
const uuid = require('uuid');
const fs = require('fs');

const CardStore = require('./cardStore');
const UserStore = require('./userStore');

const Handlers = {};

const mapImages = () => {
  return fs.readdirSync('./public/images/cards');
};

const loginSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .max(32)
    .required()
});

Handlers.loginHandler = (req, h) => {
  return new Promise((resolve, reject) => {
    loginSchema.validate(req.payload, (err, val) => {
      if (err) {
        reject(Boom.unauthorized('Credentials did not validate'));
      }

      UserStore.validateUser(val.email, val.password, (err, user) => {
        if (err) {
          reject(err);
        } else {
          req.cookieAuth.set(user);

          resolve(h.redirect('/cards'));
        }
      });
    });
  });
};

Handlers.logoutHandler = (req, h) => {
  req.cookieAuth.clear();
  return h.redirect('/');
};

const registerSchema = Joi.object().keys({
  name: Joi.string()
    .min(3)
    .max(50)
    .required(),
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .max(32)
    .required()
});

Handlers.registerHandler = (req, h) => {
  return new Promise((resolve, reject) => {
    registerSchema.validate(req.payload, (err, val) => {
      if (err) {
        reject(Boom.unauthorized('Credentials did not validate'));
      }
      UserStore.createUser(val.name, val.email, val.password, err => {
        if (err) {
          reject(err);
        } else {
          resolve(h.redirect('/cards'));
        }
      });
    });
  });
};

Handlers.cardsHandler = (req, h) => {
  return h.view('cards', { cards: getCards(req.auth.credentials.email) });
};

const cardSchema = Joi.object().keys({
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
    return cardSchema.validate(req.payload, (err, val) => {
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

const getCards = email => {
  const cards = [];
  for (const key in CardStore.cards) {
    if (CardStore.cards[key].sender_email === email) {
      cards.push(CardStore.cards[key]);
    }
  }
  return cards;
};

const saveCard = card => {
  const id = uuid.v1();
  card.id = id;
  CardStore.cards[id] = card;
};

module.exports = Handlers;
