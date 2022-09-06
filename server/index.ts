/* eslint-disable @next/next/no-assign-module-variable */
import Fastify from 'fastify';

import { route as firstRoute } from './api/hello';
import { route as out } from './out';

const app = Fastify({
  logger: true
});

app.register(out)
app.register(firstRoute)

app.get('/ping', async (request, reply) => {
  return 'pong\n'
})

module.exports = app; 