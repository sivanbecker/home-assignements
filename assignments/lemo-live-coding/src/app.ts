import Fastify, { type FastifyInstance } from 'fastify';
import { loggingOptions } from './plugins/logging';
import { registerSwagger } from './plugins/swagger';
import { registerErrorHandler } from './errors/errorHandler';
import { registerRoutes } from './routes';

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: loggingOptions,
    requestIdHeader: 'x-request-id',
    genReqId: () => crypto.randomUUID(),
  });

  await registerSwagger(app);
  registerErrorHandler(app);
  registerRoutes(app);

  return app;
}
