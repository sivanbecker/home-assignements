import type { FastifyInstance } from 'fastify';
import { getLemoHandler, postLemoHandler } from './handlers';
import { getLemoSchema, postLemoBodySchema } from './schemas';

export function registerRoutes(app: FastifyInstance): void {
  app.get('/lemo', { schema: getLemoSchema }, getLemoHandler);

  app.post('/lemo', { schema: postLemoBodySchema }, postLemoHandler);
}
