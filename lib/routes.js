const Handlers = require('./handlers');

const Routes = [
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
    }
  },
  {
    path: '/assets/{path*}',
    method: 'GET',
    handler: {
      directory: {
        path: 'public'
      }
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
