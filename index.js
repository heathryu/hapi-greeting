'use strict';

const Hapi = require('@hapi/hapi');

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost'
  });

  await server.register(require('@hapi/inert'));

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
  })

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRjection', err => {
  console.log(err);
  process.exit(1);
});

init();
