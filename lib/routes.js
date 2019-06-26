const Handlers = require('./handlers');

const Routes = [
  {
    path: '/login',
    method: 'GET',
    handler: {
      file: 'templates/login.html'
    },
    config: {
      auth: false
    }
  },
  {
    path: '/hello',
    method: 'GET',
    handler: () => {
      return 'hello';
    }
  },
  {
    path: '/',
    method: 'GET',
    handler: {
      file: 'templates/index.html'
    },
    config: {
      auth: false
    }
  },
  {
    path: '/assets/{path*}',
    method: 'GET',
    handler: {
      directory: {
        path: 'public'
      }
    },
    config: {
      auth: false
    }
  },
  {
    path: '/cards',
    method: 'GET',
    handler: Handlers.cardsHandler
  },
  {
    path: '/cards/new',
    method: ['GET', 'POST'],
    handler: Handlers.newCardHandler
  },
  {
    path: '/cards/{id}',
    method: 'DELETE',
    handler: Handlers.deleteCardHandler
  }
];

module.exports = Routes;
