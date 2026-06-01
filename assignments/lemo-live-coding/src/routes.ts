import type { FastifyInstance } from 'fastify';
import { getLemoHandler, postLemoHandler, getCarsHandler, postQuoteHandler } from './handlers';
import { getLemoSchema, postLemoBodySchema, getCarsSchema, postQuoteSchema } from './schemas';

export function registerRoutes(app: FastifyInstance): void {
  app.get('/lemo', { schema: getLemoSchema }, getLemoHandler);
  app.post('/lemo', { schema: postLemoBodySchema }, postLemoHandler);

  app.get('/cars', { schema: getCarsSchema }, getCarsHandler);
  app.post('/quote', { schema: postQuoteSchema }, postQuoteHandler);
}
