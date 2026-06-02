import type { FastifyInstance, FastifyError } from 'fastify';
import { WebError } from './WebError';

export function registerErrorHandler(app: FastifyInstance): void {
  app.setErrorHandler((error: FastifyError | WebError, _request, reply) => {
    app.log.error(error);
    const statusCode = error instanceof WebError ? error.statusCode : (error.statusCode ?? 500);
    reply.status(statusCode).send({
      statusCode,
      error: error.name,
      message: error.message,
    });
  });
}
