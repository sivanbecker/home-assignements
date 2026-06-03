import type { FastifyInstance } from 'fastify';
import { getLemoHandler, postLemoHandler } from './handlers';
import { getLemoSchema, postLemoBodySchema } from './schemas';
import { startHandler, profileHandler, quoteHandler, bindHandler, statusHandler } from './onboarding/handlers';
import { startSchema, profileSchema, quoteSchema, bindSchema, statusSchema } from './onboarding/schemas';

export function registerRoutes(app: FastifyInstance): void {
  app.get('/lemo', { schema: getLemoSchema }, getLemoHandler);
  app.post('/lemo', { schema: postLemoBodySchema }, postLemoHandler);

  app.post('/onboarding/start', { schema: startSchema }, startHandler);
  app.post('/onboarding/:sessionId/profile', { schema: profileSchema }, profileHandler);
  app.post('/onboarding/:sessionId/quote', { schema: quoteSchema }, quoteHandler);
  app.post('/onboarding/:sessionId/bind', { schema: bindSchema }, bindHandler);
  app.get('/onboarding/:sessionId', { schema: statusSchema }, statusHandler);
}
