import type { FastifyInstance } from 'fastify';
import { getLemoHandler, postLemoHandler } from './handlers';
import { postLemoBodySchema } from './schemas';

export function registerRoutes(app: FastifyInstance): void {
  app.get('/lemo', getLemoHandler);

  app.post('/lemo', { schema: postLemoBodySchema }, postLemoHandler);
}
