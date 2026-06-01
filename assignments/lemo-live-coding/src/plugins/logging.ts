import type { FastifyServerOptions } from 'fastify';
import { config } from '../config';

const isDev = process.env['NODE_ENV'] === 'development';

export const loggingOptions: FastifyServerOptions['logger'] = {
  level: config.logLevel,
  transport: isDev ? { target: 'pino-pretty', options: { colorize: true } } : undefined,
};
