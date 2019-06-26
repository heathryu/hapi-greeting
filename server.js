'use strict';

const Hapi = require('@hapi/hapi');

const Cookie = require('@hapi/Cookie');

const Good = require('@hapi/good');
const GoodFileReporter = require('./lib/goodFileReporter');

const Routes = require('./lib/routes');

const CardStore = require('./lib/cardStore');

CardStore.initialize();

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

  await server.register(Cookie);

  server.auth.strategy('session', 'cookie', {
    cookie: {
      password: 'soSecure',
      isSecure: false
    },
    redirectTo: '/login'
  });

  server.auth.default('session');

  await server.register({
    plugin: Good,
    options: {
      ops: {
        interval: 10000
      },
      reporters: {
        processReporter: [
          {
            module: '@hapi/good-squeeze',
            name: 'Squeeze',
            args: [{ ops: '*' }]
          },
          {
            module: '@hapi/good-squeeze',
            name: 'SafeJson'
          },
          {
            module: GoodFileReporter,
            args: ['./logs/process']
          }
        ],
        requestsReporter: [
          {
            module: '@hapi/good-squeeze',
            name: 'Squeeze',
            args: [{ response: '*' }]
          },
          {
            module: '@hapi/good-squeeze',
            name: 'SafeJson'
          },
          {
            module: GoodFileReporter,
            args: ['./logs/requests']
          }
        ],
        errorReporter: [
          {
            module: '@hapi/good-squeeze',
            name: 'Squeeze',
            args: [{ error: '*' }]
          },
          {
            module: '@hapi/good-squeeze',
            name: 'SafeJson'
          },
          {
            module: GoodFileReporter,
            args: ['./logs/errors']
          }
        ]
      }
    }
  });

  server.ext('onPreResponse', (req, h) => {
    if (req.response.isBoom) {
      return h.view('error', req.response);
    }

    return h.continue;
  });

  server.route(Routes);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRjection', err => {
  console.log(err);
  process.exit(1);
});

init();
