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
    path: '/login',
    method: 'POST',
    handler: Handlers.loginHandler,
    config: {
      auth: false
    }
  },
  {
    path: '/logout',
    method: 'GET',
    handler: Handlers.logoutHandler
  },
  {
    path: '/register',
    method: 'GET',
    handler: {
      file: 'templates/register.html'
    },
    config: {
      auth: false
    }
  },
  {
    path: '/register',
    method: 'POST',
    handler: Handlers.registerHandler,
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
