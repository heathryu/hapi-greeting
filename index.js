'use strict';

const Hapi = require('@hapi/hapi');
const uuid = require('uuid');
const fs = require('fs');

const loadCards = () => {
  const file = fs.readFileSync('./cards.json');
  return JSON.parse(file.toString());
};

const cards = loadCards();

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost'
  });

  await server.register(require('@hapi/inert'));
  await server.register(require('@hapi/vision'));

  server.views({
    engines: {
      html: require('handlebars')
    },
    path: 'templates'
  });

  server.ext('onRequest', (req, h) => {
    console.log('Received request: ' + req.path);
    return h.continue;
  });

  server.route({
    path: '/hello',
    method: 'GET',
    handler: (req, h) => {
      return 'hello';
    }
  });

  server.route({
    path: '/',
    method: 'GET',
    handler: {
      file: 'templates/index.html'
    }
  });

  server.route({
    path: '/assets/{path*}',
    method: 'GET',
    handler: {
      directory: {
        path: 'public'
      }
    }
  });

  server.route({
    path: '/cards',
    method: 'GET',
    handler: cardsHandler
  });

  server.route({
    path: '/cards/new',
    method: ['GET', 'POST'],
    handler: newCardHandler
  });

  server.route({
    path: '/cards/{id}',
    method: 'DELETE',
    handler: deleteCardHandler
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

const cardsHandler = (req, h) => {
  return h.view('cards', { cards });
};

const newCardHandler = (req, h) => {
  if (req.method === 'get') {
    return h.view('new');
  } else if (req.method === 'post') {
    const card = {
      name: req.payload.name,
      recipient_email: req.payload.recipient_email,
      sender_name: req.payload.sender_name,
      sender_email: req.payload.sender_email,
      card_image: req.payload.card_image
    };

    saveCard(card);

    console.log(cards);

    return h.redirect('/cards');
  }
};

const deleteCardHandler = (req, h) => {
  delete cards[req.params.id];
  return h.response();
};

const saveCard = card => {
  const id = uuid.v1();
  card.id = id;
  cards[id] = card;
};

process.on('unhandledRjection', err => {
  console.log(err);
  process.exit(1);
});

init();
