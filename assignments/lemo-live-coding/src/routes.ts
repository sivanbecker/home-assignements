import type { FastifyInstance } from 'fastify';
import { getLemoHandler, postLemoHandler } from './handlers';
import { getLemoSchema, postLemoBodySchema } from './schemas';
import { makeOnboardingHandlers } from './onboarding/handlers';
import { startSchema, profileSchema, quoteSchema, bindSchema, statusSchema } from './onboarding/schemas';
import { SessionStore } from './onboarding/SessionStore';
import { QuoteEngine, AgeFactor, CarCountFactor } from './onboarding/QuoteEngine';
import type { AppOptions } from './app';

export function registerRoutes(app: FastifyInstance, options?: AppOptions): void {
  app.get('/lemo', { schema: getLemoSchema }, getLemoHandler);
  app.post('/lemo', { schema: postLemoBodySchema }, postLemoHandler);

  const store = options?.store ?? new SessionStore();
  const engine = new QuoteEngine({
    perCarFactors: [new AgeFactor()],
    totalFactors: [new CarCountFactor()],
  });
  const { startHandler, profileHandler, quoteHandler, bindHandler, statusHandler } =
    makeOnboardingHandlers(store, engine);

  app.post('/onboarding/start', { schema: startSchema }, startHandler);
  app.post('/onboarding/:sessionId/profile', { schema: profileSchema }, profileHandler);
  app.post('/onboarding/:sessionId/quote', { schema: quoteSchema }, quoteHandler);
  app.post('/onboarding/:sessionId/bind', { schema: bindSchema }, bindHandler);
  app.get('/onboarding/:sessionId', { schema: statusSchema }, statusHandler);
}
