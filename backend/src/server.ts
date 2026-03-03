import Fastify from 'fastify';
import cors from '@fastify/cors';
import { setupSocket } from './socket.js';
import { log } from './utils/logger.js';

const fastify = Fastify();

await fastify.register(cors, {
  origin: '*',
});

const start = async () => {
  try {
    await fastify.listen({ port: 4000, host: '0.0.0.0' });

    setupSocket(fastify.server);

    log('Server started');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
